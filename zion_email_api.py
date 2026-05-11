from fastapi import FastAPI
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

app = FastAPI()

@app.post('/send-email')
async def send_email(endpoint: dict):
    try:
        message = Mail(
            from_email='support@ziontechgroup.com',
            to_emails=endpoint['email'],
            subject=endpoint['subject'],
            html_content=endpoint['html_content']
        )
        sg = SendGridAPIClient(os.getenv('SENDGRID_API_KEY'))
        response = sg.send(message)
        return {"status": "success", "response": response.status_code}
    except Exception as e:
        return {"status": "error", "message": str(e)}