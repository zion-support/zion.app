import os
import re
import logging
from typing import Dict, Any
from fastapi import FastAPI, HTTPException, status
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Zion Tech Group Email Service")

# Email validation regex
EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')

def is_valid_email(email: str) -> bool:
    """Validate email format."""
    return bool(EMAIL_REGEX.match(email))

def validate_email_request(data: Dict[str, Any]) -> Dict[str, str]:
    """Validate email request data and return cleaned data."""
    errors = []
    
    # Validate required fields
    if not data.get('email'):
        errors.append("Email is required")
    elif not is_valid_email(data['email']):
        errors.append("Invalid email format")
    
    if not data.get('subject'):
        errors.append("Subject is required")
    elif len(data['subject']) > 200:
        errors.append("Subject too long (max 200 characters)")
    
    if not data.get('html_content'):
        errors.append("HTML content is required")
    elif len(data['html_content']) > 100000:  # 100KB limit
        errors.append("HTML content too large (max 100KB)")
    
    if errors:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"errors": errors}
        )
    
    return {
        'email': data['email'].strip(),
        'subject': data['subject'].strip(),
        'html_content': data['html_content']
    }

@app.post('/send-email')
async def send_email(endpoint: dict):
    """
    Send an email via SendGrid.
    
    Expected JSON payload:
    {
        "email": "recipient@example.com",
        "subject": "Email Subject",
        "html_content": "<h1>HTML Content</h1>"
    }
    """
    try:
        # Validate input
        cleaned_data = validate_email_request(endpoint)
        
        # Get configuration from environment
        sendgrid_api_key = os.getenv('SENDGRID_API_KEY')
        from_email = os.getenv('SENDGRID_FROM_EMAIL', 'support@ziontechgroup.com')
        from_name = os.getenv('SENDGRID_FROM_NAME', 'Zion Tech Group Support')
        
        if not sendgrid_api_key:
            logger.error("SENDGRID_API_KEY not configured")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Email service not configured"
            )
        
        # Create email message
        from_email_obj = Email(from_email, from_name)
        to_email_obj = To(cleaned_data['email'])
        content = Content("text/html", cleaned_data['html_content'])
        mail = Mail(from_email_obj, to_email_obj, cleaned_data['subject'], content)
        
        # Send email
        sg = SendGridAPIClient(sendgrid_api_key)
        response = sg.send(mail)
        
        # Log successful send
        logger.info(
            f"Email sent successfully to {cleaned_data['email']} "
            f"with subject '{cleaned_data['subject']}' "
            f"Status: {response.status_code}"
        )
        
        return {
            "status": "success",
            "message": "Email sent successfully",
            "status_code": response.status_code
        }
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        # Log unexpected errors
        logger.error(f"Failed to send email: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send email: {str(e)}"
        )

@app.get('/health')
async def health_check():
    """Health check endpoint."""
    sendgrid_configured = bool(os.getenv('SENDGRID_API_KEY'))
    return {
        "status": "healthy" if sendgrid_configured else "degraded",
        "sendgrid_configured": sendgrid_configured,
        "service": "zion-email-api"
    }