AimHigh – AI Career Coach

AimHigh is an AI-powered career coaching platform designed to help users plan, prepare, and progress in their professional journey. It uses advanced artificial intelligence to deliver personalized career guidance, resume and cover letter generation, and mock interview practice — all within one smart and intuitive platform.

Key Features

* AI Career Guidance
Get tailored career advice, skill recommendations, and roadmap suggestions based on your career goals and interests.

* Resume and Cover Letter Builder
Instantly generate professional, ATS-friendly resumes and cover letters customized for your desired role.

* AI-Powered Mock Interviews
Practice real-time interviews with intelligent AI feedback, role-based questions, and improvement insights.

* Career Progress Dashboard
Track growth, analyze performance, and identify skill gaps using smart analytics.

* Secure Authentication
User login and management are handled through Clerk for reliable and safe access control.

Tech Stack

Frontend: Next.js, React, Tailwind CSS
Backend: Node.js, Express.js
Database: Neon PostgreSQL with Drizzle ORM
Authentication: Clerk
AI Integration: Gemini API

Installation and Setup

Clone the repository
git clone https://github.com/your-username/aimhigh-ai-career-coach.git

cd aimhigh-ai-career-coach

Install dependencies
npm install

Add environment variables
Create a file named .env.local in the project root and add:
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
OPENAI_API_KEY=your_gemini_api_key
DATABASE_URL=your_neon_database_url

Start the development server
npm run dev

AI Capabilities

AimHigh integrates with Gemini models to generate resumes, cover letters, interview responses, and provide detailed career insights. It helps users identify learning paths, skill gaps, and areas for professional improvement.

“Empowering every career journey with intelligent guidance – AimHigh, your AI Career Coach.”
