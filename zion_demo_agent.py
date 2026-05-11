import json
import os
from typing import Dict, List, Any
import openai
import random

class ZionAIDemoGenerator:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        self.client = openai.OpenAI(api_key=self.api_key)
        
    def analyze_user_behavior(self, behavior_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze user behavior to generate personalized demo"""
        try:
            # Example behavior data structure
            # {
            #   "pages_visited": ["/services/ai-chatbot", "/services/data-validation"],
            #   "time_on_page": {"ai-chatbot": 120, "data-validation": 45},
            #   "clicks": ["pricing", "demo-request", "contact-us"],
            #   "referrer": "google",
            #   "device": "mobile"
            # }
            
            # Determine user intent based on behavior
            primary_service = self._determine_primary_service(behavior_data)
            user_intent = self._determine_user_intent(behavior_data)
            
            return {
                "primary_service": primary_service,
                "user_intent": user_intent,
                "personalization_level": self._calculate_personalization_score(behavior_data),
                "recommended_demo": self._generate_demo_recommendation(primary_service, user_intent)
            }
            
        except Exception as e:
            return {"error": f"Analysis failed: {str(e)}"}
            
    def _determine_primary_service(self, behavior_data: Dict[str, Any]) -> str:
        """Determine primary service based on page visits"""
        if not behavior_data.get("pages_visited"):
            return "general"
            
        page_visits = behavior_data["pages_visited"]
        
        # Count occurrences of each service page
        service_counts = {}
        for page in page_visits:
            if "/services/" in page:
                service = page.replace("/services/", "").split("/")[0]
                service_counts[service] = service_counts.get(service, 0) + 1
                
        if service_counts:
            # Return most visited service
            return max(service_counts, key=service_counts.get)
        
        return "general"
        
    def _determine_user_intent(self, behavior_data: Dict[str, Any]) -> str:
        """Determine user intent based on clicks and time spent"""
        clicks = behavior_data.get("clicks", [])
        time_on_page = behavior_data.get("time_on_page", {})
        
        # Check for pricing clicks
        if any(click in ["pricing", "pricing-page", "pricing-link"] for click in clicks):
            return "pricing_inquiry"
            
        # Check for demo requests
        if any(click in ["demo", "demo-request", "request-demo"] for click in clicks):
            return "demo_request"
            
        # Check for contact clicks
        if any(click in ["contact", "contact-us", "get-in-touch"] for click in clicks):
            return "contact_inquiry"
            
        # Check time spent on pages
        for page, time_spent in time_on_page.items():
            if time_spent > 60:  # More than 1 minute
                return "researching"
                
        return "browsing"
        
    def _calculate_personalization_score(self, behavior_data: Dict[str, Any]) -> float:
        """Calculate personalization score (0-1)"""
        pages_visited = behavior_data.get("pages_visited", [])
        time_on_page = behavior_data.get("time_on_page", {})
        clicks = behavior_data.get("clicks", [])
        
        score = 0.0
        
        # Add points for page visits
        if len(pages_visited) >= 3:
            score += 0.3
        elif len(pages_visited) >= 2:
            score += 0.2
        
        # Add points for time spent
        total_time = sum(time_on_page.values())
        if total_time >= 180:  # 3+ minutes
            score += 0.3
        elif total_time >= 120:  # 2+ minutes
            score += 0.2
        
        # Add points for specific clicks
        if any(click in ["demo", "demo-request"] for click in clicks):
            score += 0.3
        elif any(click in ["pricing", "contact"] for click in clicks):
            score += 0.2
        
        return min(score, 1.0)  # Cap at 1.0
        
    def _generate_demo_recommendation(self, service: str, intent: str) -> Dict[str, Any]:
        """Generate demo recommendation based on service and intent"""
        demos = {
            "ai-chatbot": {
                "title": "AI Chatbot Demo",
                "description": "See how our AI chatbot can automate customer support and increase engagement.",
                "features": ["24/7 automated support", "Multi-language support", "CRM integration"],
                "duration": "5 minutes",
                "cta": "Start Chatbot Demo"
            },
            "data-validation": {
                "title": "Data Validation Demo",
                "description": "Learn how our data validation service ensures data quality and accuracy.",
                "features": ["Real-time validation", "Bulk processing", "API integration"],
                "duration": "7 minutes",
                "cta": "Start Data Validation Demo"
            },
            "project-management": {
                "title": "Project Management Demo",
                "description": "Discover how our project management tool streamlines workflows and boosts productivity.",
                "features": ["Task automation", "Team collaboration", "Real-time analytics"],
                "duration": "8 minutes",
                "cta": "Start Project Management Demo"
            },
            "iot-monitoring": {
                "title": "IoT Monitoring Demo",
                "description": "See how our IoT monitoring dashboard provides real-time insights and alerts.",
                "features": ["Real-time monitoring", "Predictive maintenance", "Custom alerts"],
                "duration": "6 minutes",
                "cta": "Start IoT Monitoring Demo"
            },
            "social-media-scheduler": {
                "title": "Social Media Scheduler Demo",
                "description": "Learn how our social media scheduler automates posting across platforms.",
                "features": ["Multi-platform scheduling", "Content calendar", "Analytics dashboard"],
                "duration": "5 minutes",
                "cta": "Start Social Media Scheduler Demo"
            },
            "general": {
                "title": "Company Overview Demo",
                "description": "Get an overview of Zion Tech Group and our comprehensive service offerings.",
                "features": ["All services overview", "Case studies", "Client testimonials"],
                "duration": "10 minutes",
                "cta": "Start Company Overview Demo"
            }
        }
        
        # Select appropriate demo
        if service in demos:
            return demos[service]
        else:
            return demos["general"]
            
    def generate_personalized_demo(self, behavior_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate complete personalized demo experience"""
        try:
            # Analyze user behavior
            analysis = self.analyze_user_behavior(behavior_data)
            
            if "error" in analysis:
                return analysis
                
            # Generate personalized content using GPT-4
            demo_content = self._generate_demo_content(analysis)
            
            return {
                "analysis": analysis,
                "demo_content": demo_content,
                "recommendations": self._generate_recommendations(analysis),
                "next_steps": self._generate_next_steps(analysis)
            }
            
        except Exception as e:
            return {"error": f"Demo generation failed: {str(e)}"}
            
    def _generate_demo_content(self, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Generate personalized demo content using GPT-4"""
        try:
            # Create prompt for GPT-4
            prompt = f"""
            Create a personalized demo experience for a website visitor based on their behavior analysis.
            
            User Analysis:
            - Primary Service: {analysis["primary_service"]}
            - User Intent: {analysis["user_intent"]}
            - Personalization Level: {analysis["personalization_level"]:.0%}
            - Recommended Demo: {analysis["recommended_demo"]["title"]}
            
            Generate a comprehensive demo script that includes:
            1. Personalized introduction based on user intent
            2. Service-specific demonstration tailored to user needs
            3. Key benefits and features relevant to the user
            4. Interactive elements or questions to engage the user
            5. Clear call-to-action based on user intent
            6. Next steps and follow-up recommendations
            
            Keep the demo engaging and focused on solving the user's specific needs.
            """
            
            # Call GPT-4
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=1000
            )
            
            return {
                "prompt": prompt,
                "response": response.choices[0].message.content,
                "generated_at": time.strftime("%Y-%m-%d %H:%M:%S")
            }
            
        except Exception as e:
            return {"error": f"Content generation failed: {str(e)}"}
            
    def _generate_recommendations(self, analysis: Dict[str, Any]) -> List[Dict[str, str]]:
        """Generate personalized recommendations"""
        recommendations = []
        
        # Base recommendations on user intent
        if analysis["user_intent"] == "demo_request":
            recommendations.append({
                "title": "Schedule a Live Demo",
                "description": "Connect with our experts for a personalized live demonstration.",
                "action": "schedule_demo",
                "priority": "high"
            })
            recommendations.append({
                "title": "Download Case Study",
                "description": "See how we helped similar companies achieve their goals.",
                "action": "download_case_study",
                "priority": "medium"
            })
            
        elif analysis["user_intent"] == "pricing_inquiry":
            recommendations.append({
                "title": "View Pricing Plans",
                "description": "Explore our transparent pricing options.",
                "action": "view_pricing",
                "priority": "high"
            })
            recommendations.append({
                "title": "Get Custom Quote",
                "description": "Receive a personalized quote based on your specific needs.",
                "action": "get_quote",
                "priority": "high"
            })
            
        elif analysis["user_intent"] == "contact_inquiry":
            recommendations.append({
                "title": "Contact Sales Team",
                "description": "Speak directly with our sales representatives.",
                "action": "contact_sales",
                "priority": "high"
            })
            recommendations.append({
                "title": "Book Consultation",
                "description": "Schedule a free consultation with our experts.",
                "action": "book_consultation",
                "priority": "high"
            })
            
        else:  # browsing or researching
            recommendations.append({
                "title": "Explore Our Services",
                "description": "Learn more about our comprehensive service offerings.",
                "action": "explore_services",
                "priority": "medium"
            })
            recommendations.append({
                "title": "Read Customer Success Stories",
                "description": "Discover how we've helped other businesses succeed.",
                "action": "read_success_stories",
                "priority": "medium"
            })
            
        return recommendations
        
    def _generate_next_steps(self, analysis: Dict[str, Any]) -> List[Dict[str, str]]:
        """Generate next steps based on user analysis"""
        next_steps = []
        
        # Always include follow-up
        next_steps.append({
            "title": "Follow-up Email",
            "description": "Receive a personalized email with demo highlights and next steps.",
            "action": "send_follow_up_email",
            "timing": "within 24 hours"
        })
        
        # Add specific next steps based on intent
        if analysis["user_intent"] == "demo_request":
            next_steps.append({
                "title": "Schedule Implementation Call",
                "description": "Plan the next steps for getting started with our service.",
                "action": "schedule_implementation",
                "timing": "within 48 hours"
            })
            
        elif analysis["user_intent"] == "pricing_inquiry":
            next_steps.append({
                "title": "Prepare Custom Proposal",
                "description": "Create a tailored proposal based on your specific requirements.",
                "action": "prepare_proposal",
                "timing": "within 24 hours"
            })
            
        return next_steps

def main():
    """Test the AI demo generator"""
    # Initialize the demo generator
    demo_generator = ZionAIDemoGenerator()
    
    # Test data - simulate user behavior
    test_behavior_data = {
        "pages_visited": ["/services/ai-chatbot", "/services/data-validation", "/pricing"],
        "time_on_page": {"ai-chatbot": 120, "data-validation": 45, "pricing": 90},
        "clicks": ["pricing", "demo-request", "contact-us"],
        "referrer": "google",
        "device": "mobile",
        "location": "New York, USA",
        "industry": "e-commerce"
    }
    
    # Generate personalized demo
    result = demo_generator.generate_personalized_demo(test_behavior_data)
    
    # Print results
    print("=== AI-Powered Demo Generation ===")
    print(f"Status: {'Success' if 'error' not in result else 'Failed'}")
    
    if "error" not in result:
        print(f"\nUser Analysis:")
        print(f"Primary Service: {result['analysis']['primary_service']}")
        print(f"User Intent: {result['analysis']['user_intent']}")
        print(f"Personalization Level: {result['analysis']['personalization_level']:.0%}")
        print(f"Recommended Demo: {result['analysis']['recommended_demo']['title']}")
        
        print(f"\nDemo Content:")
        print(result['demo_content']['response'][:500] + "...")  # Print first 500 chars
        
        print(f"\nRecommendations:")
        for rec in result['recommendations']:
            print(f"- {rec['title']}: {rec['description']}")
            
        print(f"\nNext Steps:")
        for step in result['next_steps']:
            print(f"- {step['title']} ({step['timing']})")
    else:
        print(f"Error: {result['error']}")

if __name__ == "__main__":
    main()