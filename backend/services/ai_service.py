import google.generativeai as genai
import json
from core.config import settings

# Only configure if API key is provided
model = None
if settings.GOOGLE_API_KEY:
    try:
        genai.configure(api_key=settings.GOOGLE_API_KEY)
        model = genai.GenerativeModel('gemini-flash-latest')
        print("✓ Google AI configured successfully")
    except Exception as e:
        print(f"⚠ Warning: Could not configure Google AI: {e}")
        model = None
else:
    print("⚠ Warning: No GOOGLE_API_KEY found. AI features will be disabled.")

async def analyze_resume(text: str) -> dict:
    """
    Analyze resume text using AI. Returns basic structure if AI is not available.
    """
    # If no AI model available, return basic structure
    if not model:
        print("⚠ AI analysis skipped - no API key configured")
        return {
            "personal_info": {"name": "", "email": "", "phone": "", "linkedin": "", "location": ""},
            "education": [],
            "experience": [],
            "skills": {"technical": [], "soft": [], "tools": []},
            "projects": [],
            "certifications": [],
            "note": "AI analysis unavailable - please configure GOOGLE_API_KEY for full analysis"
        }
    
    prompt = """
    You are an expert Resume Parser. Extract the following information from the resume text into a strict JSON format.
    
    Structure:
    {
        "personal_info": {"name": "", "email": "", "phone": "", "linkedin": "", "location": ""},
        "education": [{"institution": "", "degree": "", "start_date": "", "end_date": "", "gpa": ""}],
        "experience": [{"company": "", "title": "", "start_date": "", "end_date": "", "description": "", "skills_used": []}],
        "skills": {"technical": [], "soft": [], "tools": []},
        "projects": [{"name": "", "description": "", "technologies": []}],
        "certifications": [{"name": "", "issuer": "", "date": ""}]
    }
    
    Resume Text:
    """ + text
    
import re

def extract_json(text: str) -> dict:
    """
    Robustly extract JSON from text using regex, handling potential markdown blocks or extra text.
    """
    try:
        # First try direct JSON parse
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Try to find JSON block code
    if "```" in text:
        # Remove ```json and ``` wrapping
        text = re.sub(r'```json\s*', '', text)
        text = re.sub(r'```\s*', '', text)
        try:
            return json.loads(text.strip())
        except json.JSONDecodeError:
            pass

    # Regex to find the first { ... } object (non-greedy)
    # This matches the outermost braces
    match = re.search(r'(\{.*\})', text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1))
        except json.JSONDecodeError:
            pass
            
    raise ValueError("Could not extract valid JSON from response")

async def analyze_resume(text: str) -> dict:
    """
    Analyze resume text using AI. Returns basic structure if AI is not available.
    """
    # If no AI model available, return basic structure
    if not model:
        print("⚠ AI analysis skipped - no API key configured")
        return {
            "personal_info": {"name": "", "email": "", "phone": "", "linkedin": "", "location": ""},
            "education": [],
            "experience": [],
            "skills": {"technical": [], "soft": [], "tools": []},
            "projects": [],
            "certifications": [],
            "note": "AI analysis unavailable - please configure GOOGLE_API_KEY for full analysis"
        }
    
    prompt = """
    You are an expert Resume Parser. Extract the following information from the resume text into a strict JSON format.
    
    Structure:
    {
        "personal_info": {"name": "", "email": "", "phone": "", "linkedin": "", "location": ""},
        "education": [{"institution": "", "degree": "", "start_date": "", "end_date": "", "gpa": ""}],
        "experience": [{"company": "", "title": "", "start_date": "", "end_date": "", "description": "", "skills_used": []}],
        "skills": {"technical": [], "soft": [], "tools": []},
        "projects": [{"name": "", "description": "", "technologies": []}],
        "certifications": [{"name": "", "issuer": "", "date": ""}]
    }
    
    Resume Text:
    """ + text
    
    try:
        response = model.generate_content(prompt)
        return extract_json(response.text)
    except Exception as e:
        print(f"Error in AI analysis: {e}")
        return {
            "error": f"Failed to parse resume with AI: {str(e)}",
            "raw_text_preview": text[:500] + "..." if len(text) > 500 else text
        }

async def generate_interview_questions(job_title: str, job_description: str) -> list:
    if not model:
        return [{"question": "Describe yourself and your experience."}]
    
    prompt = f"""
    Generate 5 technical and behavioral interview questions for a {job_title} role.
    
    Job Description:
    {job_description[:1000]}...
    
    Return ONLY a raw JSON list of strings. Example: ["Question 1", "Question 2"]
    """
    
    try:
        response = model.generate_content(prompt)
        # Handle list response specifically if needed, but json.loads usually handles lists too
        text = response.text
        # Clean up for list if extract_json looks for object
        try:
            # Try direct parse
            return json.loads(text)
        except:
             # Try regex for list [ ... ]
            match = re.search(r'(\[.*\])', text, re.DOTALL)
            if match:
                return json.loads(match.group(1))
            return extract_json(text) # Fallback to object finder (might fail for list)
            
    except Exception as e:
        print(f"Error generating questions: {e}")
        return ["Describe yourself.", "Why do you want this job?"]

async def evaluate_interview_answer(question: str, answer: str) -> dict:
    if not model:
        return {"feedback": "AI Not configured", "score": 0}

    prompt = f"""
    You are an expert interviewer. Evaluate the candidate's answer.
    
    Question: {question}
    Answer: {answer}
    
    Provide feedback in JSON format:
    {{
        "feedback": "Constructive feedback string...",
        "score": 85 (0-100),
        "suggested_improvement": "How to make it better..."
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        return extract_json(response.text)
    except Exception as e:
        print(f"Error evaluating answer: {e}")
        return {"feedback": f"Error processing answer: {str(e)}", "score": 0}

async def tailor_resume(resume_text: str, job_description: str) -> dict:
    if not model:
        return {"error": "AI not configured"}
    
    prompt = f"""
    You are an expert Resume Tailor. Rewrite the summary and key experience bullet points of the resume to better match the job description.
    Focus on keywords, relevant skills, and impact.
    
    Job Description:
    {job_description[:2000]}
    
    Resume Text:
    {resume_text[:2000]}
    
    Return JSON format:
    {{
        "tailored_summary": "...",
        "key_improvements": ["List of changes made..."],
        "tailored_content_preview": "Rewritten text..."
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        return extract_json(response.text)
    except Exception as e:
        print(f"Error tailoring resume: {e}")
        return {"error": f"Failed to tailor resume: {str(e)}"}

async def generate_cold_email(resume_text: str, recipient_name: str, company_name: str, job_title: str) -> dict:
    if not model:
        return {"error": "AI not configured"}
        
    prompt = f"""
    You are an expert Career Coach. Write a compelling, professional cold email to a hiring manager.
    
    Context:
    - Candidate Resume Summary: {resume_text[:1000]}...
    - Recipient: {recipient_name}
    - Company: {company_name}
    - Target Role: {job_title}
    
    The email should be:
    - Concise (under 150 words)
    - Persuasive but polite
    - Highlight 1-2 key achievements from the resume relevant to the role
    - End with a clear Call to Action (CTA)
    
    Return JSON format:
    {{
        "subject": "Email Subject Line...",
        "body": "Email Body..."
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        return extract_json(response.text)
    except Exception as e:
        print(f"Error generating cold email: {e}")
        return {"error": f"Failed to generate email: {str(e)}"}
