 My Portfolio
A full-stack personal portfolio website built with React, TypeScript, Node.js, Express, and PostgreSQL. The project includes a dynamic portfolio, contact and appointment forms, and a secure Admin CMS for managing portfolio content.
✨ Features
Public Portfolio
- Responsive personal portfolio website
- Hero, About, Skills, Education, Experience, Projects, Resume, and Contact sections
- Dynamic portfolio content loaded from the backend
- Dynamic profile/hero image
- Resume viewing
- Contact form
- Appointment booking form
- Responsive navigation and modern UI
Admin CMS
- Secure Admin Login
- Admin Dashboard
- Profile management
- Skills management
- Education management
- Experience management
- Project management
- Resume management
- Contact message management
- Appointment management
- Admin account settings
- Protected admin routes
Backend & Security
- Node.js + Express REST API
- PostgreSQL database
- JWT-based admin authentication
- Bcrypt password hashing
- Admin role authorization
- Zod request validation
- Rate limiting
- Helmet security headers
- CORS allowlist
- Secure file upload validation
- JSON/request payload limits
- Centralized error handling
- Environment-based secrets
- PostgreSQL SSL support for production
🛠️ Tech Stack
Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Motion
- Lucide React
Backend
- Node.js
- Express.js
- PostgreSQL
- pg
- JWT
- bcrypt
- Zod
- Multer
- Helmet
- express-rate-limit
Deployment
- Frontend: Vercel
- Backend: Railway
- Database: PostgreSQL
📁 Project Structure
portfolio/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── validators/
│   │   └── server.js
│   ├── package.json
│   └── package-lock.json
│
├── public/
├── src/
│   ├── components/
│   ├── context/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   └── types/
│
├── package.json
├── vite.config.ts
├── .gitignore
└── README.md
🚀 Local Development
1. Clone the repository
git clone https://github.com/pgorai45/my-portfolio.git
cd my-portfolio
2. Install frontend dependencies
npm install
3. Install backend dependencies
cd backend
npm install
cd ..
4. Configure environment variables
Create the required .env files locally.
Do not commit real secrets to GitHub.
The backend uses environment variables for configuration such as:
PORT=
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
JWT_SECRET=
ADMIN_EMAIL=
ADMIN_PASSWORD=
CLIENT_URL=
DB_SSL=
DB_SSL_REJECT_UNAUTHORIZED=
The frontend uses its Vite environment variables for services such as EmailJS.
5. Start the backend
cd backend
npm run dev
Backend:
http://localhost:5000
6. Start the frontend
Open another terminal:
cd portfolio
npm run dev
Frontend:
http://localhost:5173
🔐 Security
The project is designed with production security in mind:
- Secrets are stored in environment variables
- .env files are excluded from Git
- Runtime uploaded files are excluded from Git
- JWT authentication protects admin endpoints
- Admin role authorization is enforced
- Passwords are hashed with bcrypt
- Login and public form endpoints use rate limiting
- Request bodies are validated with Zod
- File MIME type and extension validation are applied
- Helmet provides HTTP security headers
- CORS is restricted to allowed origins
- Production PostgreSQL SSL configuration is supported
🌐 Deployment Architecture
                    ┌──────────────────┐
                    │      Vercel      │
                    │ React + Vite App │
                    └────────┬─────────┘
                             │
                             │ HTTPS API
                             ▼
                    ┌──────────────────┐
                    │     Railway      │
                    │ Node + Express   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   PostgreSQL     │
                    │    Database      │
                    └──────────────────┘
The frontend and backend are maintained in the same GitHub repository. Railway can use the backend directory as the backend service root.
📌 API Areas
The backend provides API areas for:
- Public portfolio data
- Contact submissions
- Appointment submissions
- Admin authentication
- Profile
- Skills
- Education
- Experience
- Projects
- Resume
- Contacts
- Appointments
- Admin statistics
- Admin settings
- Image and resume uploads
👨‍💻 Author
Prasanta Gorai
B.Tech Computer Science & Engineering Student
GitHub: https://github.com/pgorai45
📄 License
This project is intended as a personal portfolio project.