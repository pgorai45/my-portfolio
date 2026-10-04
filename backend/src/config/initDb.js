const pool = require("./db");
const bcrypt = require("bcryptjs");

async function initDb() {
  const client = await pool.connect();
  try {
    console.log("Beginning database initialization & migration...");
    await client.query("BEGIN");

    // 1. Admins Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        username VARCHAR(100) DEFAULT 'Admin',
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      ALTER TABLE admins ADD COLUMN IF NOT EXISTS username VARCHAR(100) DEFAULT 'Admin';
      ALTER TABLE admins ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'admin';
      ALTER TABLE admins ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
      CREATE UNIQUE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
    `);

    // 2. Contacts Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      ALTER TABLE contacts ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;
      CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_contacts_is_read ON contacts(is_read);
    `);

    // 3. Appointments Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        time TIME WITHOUT TIME ZONE NOT NULL,
        message TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      ALTER TABLE appointments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
      CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date DESC);
      CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
    `);

    // 4. Portfolio Profile Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS portfolio_profile (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        bio TEXT,
        about_intro TEXT,
        about_details TEXT,
        profile_image TEXT,
        location VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(100),
        github_url VARCHAR(255),
        linkedin_url VARCHAR(255),
        twitter_url VARCHAR(255),
        website_url VARCHAR(255),
        available_for_work BOOLEAN DEFAULT TRUE,
        is_visible BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 5. Skills Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL,
        category_label VARCHAR(100),
        proficiency_subtitle VARCHAR(255),
        percentage INTEGER NOT NULL DEFAULT 85,
        display_order INTEGER NOT NULL DEFAULT 0,
        is_visible BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
      CREATE INDEX IF NOT EXISTS idx_skills_display_order ON skills(display_order);
      CREATE INDEX IF NOT EXISTS idx_skills_is_visible ON skills(is_visible);
    `);

    // 6. Education Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS education (
        id SERIAL PRIMARY KEY,
        institution VARCHAR(255) NOT NULL,
        degree VARCHAR(255) NOT NULL,
        stream VARCHAR(255),
        start_year VARCHAR(50) NOT NULL,
        end_year VARCHAR(50),
        grade VARCHAR(50),
        description TEXT,
        coursework JSONB DEFAULT '[]'::jsonb,
        display_order INTEGER NOT NULL DEFAULT 0,
        is_visible BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_education_display_order ON education(display_order);
      CREATE INDEX IF NOT EXISTS idx_education_is_visible ON education(is_visible);
    `);

    // 7. Experience Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS experience (
        id SERIAL PRIMARY KEY,
        company VARCHAR(255) NOT NULL,
        position VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        start_date VARCHAR(50) NOT NULL,
        end_date VARCHAR(50),
        currently_working BOOLEAN DEFAULT FALSE,
        description TEXT,
        technologies JSONB DEFAULT '[]'::jsonb,
        accent_color VARCHAR(50) DEFAULT 'purple',
        display_order INTEGER NOT NULL DEFAULT 0,
        is_visible BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_experience_display_order ON experience(display_order);
      CREATE INDEX IF NOT EXISTS idx_experience_is_visible ON experience(is_visible);
    `);

    // 8. Projects Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255),
        title VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        short_description TEXT,
        description TEXT NOT NULL,
        image_url TEXT,
        technologies JSONB DEFAULT '[]'::jsonb,
        github_url VARCHAR(255),
        live_demo_url VARCHAR(255),
        accent VARCHAR(50) DEFAULT 'purple',
        preview_type VARCHAR(50) DEFAULT 'assistant',
        display_order INTEGER NOT NULL DEFAULT 0,
        is_featured BOOLEAN DEFAULT TRUE,
        is_published BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_projects_display_order ON projects(display_order);
      CREATE INDEX IF NOT EXISTS idx_projects_is_published ON projects(is_published);
      CREATE INDEX IF NOT EXISTS idx_projects_is_featured ON projects(is_featured);
    `);

    // 9. Resumes Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS resumes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(255) NOT NULL,
        file_size INTEGER,
        mime_type VARCHAR(100) DEFAULT 'application/pdf',
        is_active BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_resumes_is_active ON resumes(is_active);
    `);

    // 10. Activity / Audit Logs Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(100) NOT NULL,
        entity_id VARCHAR(100),
        details TEXT,
        ip_address VARCHAR(100),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
    `);

    // ==========================================
    // SEEDING INITIAL DATA IF EMPTY
    // ==========================================

    // Seed Admin
    const adminCheck = await client.query("SELECT COUNT(*) FROM admins");
    if (parseInt(adminCheck.rows[0].count, 10) === 0) {
      const email = process.env.ADMIN_EMAIL;
      const pass = process.env.ADMIN_PASSWORD;

      if (!email || !pass) {
        throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be configured");
      }
      
      const hash = bcrypt.hashSync(pass, 10);
      await client.query(
        `INSERT INTO admins (email, password_hash, username, role)
         VALUES ($1, $2, 'Prasanta Gorai', 'admin')`,
        [email, hash],
      );
      console.log(`Seeded default admin account: ${email}`);
    }

    // Seed Profile
    const profileCheck = await client.query(
      "SELECT COUNT(*) FROM portfolio_profile",
    );
    if (parseInt(profileCheck.rows[0].count, 10) === 0) {
      await client.query(
        `INSERT INTO portfolio_profile (
          name, title, bio, about_intro, about_details, profile_image,
          location, email, phone, github_url, linkedin_url, twitter_url, website_url,
          available_for_work, is_visible
        ) VALUES (
          'Prasanta Gorai',
          'Full Stack Developer',
          'I build modern, scalable and interactive web applications with clean code and great user experiences.',
          'I am Prasanta Gorai, a Computer Science student and aspiring Full Stack Developer who enjoys building modern and interactive web applications.',
          'I enjoy learning how modern web applications work from frontend interfaces to backend systems and databases. My goal is to continuously improve my development skills and build useful, scalable and user-friendly applications.\n\nI am currently focusing on strengthening my skills in React, TypeScript, backend development, databases and modern software development practices.',
          '',
          'West Bengal, India',
          'prasantagorai.dev@gmail.com',
          '+91 9876543210',
          'https://github.com/pgorai45',
          'https://www.linkedin.com/in/prasanta-gorai-8a77813a6/',
          '',
          'https://portfolio.dev',
          true,
          true
        )`,
      );
      console.log("Seeded initial portfolio profile.");
    }

    // Seed Skills
    const skillsCheck = await client.query("SELECT COUNT(*) FROM skills");
    if (parseInt(skillsCheck.rows[0].count, 10) === 0) {
      const initialSkills = [
        // Frontend
        {
          name: "React",
          category: "frontend",
          category_label: "Frontend",
          percentage: 90,
          display_order: 1,
        },
        {
          name: "TypeScript",
          category: "frontend",
          category_label: "Frontend",
          percentage: 85,
          display_order: 2,
        },
        {
          name: "JavaScript",
          category: "frontend",
          category_label: "Frontend",
          percentage: 92,
          display_order: 3,
        },
        {
          name: "HTML5",
          category: "frontend",
          category_label: "Frontend",
          percentage: 95,
          display_order: 4,
        },
        {
          name: "CSS3",
          category: "frontend",
          category_label: "Frontend",
          percentage: 90,
          display_order: 5,
        },
        {
          name: "Tailwind CSS",
          category: "frontend",
          category_label: "Frontend",
          percentage: 92,
          display_order: 6,
        },
        // Backend
        {
          name: "Python",
          category: "backend",
          category_label: "Backend",
          percentage: 86,
          display_order: 7,
        },
        {
          name: "Flask",
          category: "backend",
          category_label: "Backend",
          percentage: 80,
          display_order: 8,
        },
        {
          name: "Node.js",
          category: "backend",
          category_label: "Backend",
          percentage: 85,
          display_order: 9,
        },
        {
          name: "REST API",
          category: "backend",
          category_label: "Backend",
          percentage: 90,
          display_order: 10,
        },
        // Core CS
        {
          name: "DSA",
          category: "core_cs",
          category_label: "Core CS",
          proficiency_subtitle: "Data Structures & Algorithms",
          percentage: 88,
          display_order: 11,
        },
        {
          name: "OOP",
          category: "core_cs",
          category_label: "Core CS",
          proficiency_subtitle: "Object-Oriented Programming",
          percentage: 90,
          display_order: 12,
        },
        {
          name: "DBMS",
          category: "core_cs",
          category_label: "Core CS",
          proficiency_subtitle: "Database Management Systems",
          percentage: 88,
          display_order: 13,
        },
        {
          name: "Operating Systems",
          category: "core_cs",
          category_label: "Core CS",
          proficiency_subtitle: "Process, Threads & Memory",
          percentage: 84,
          display_order: 14,
        },
        {
          name: "Computer Networks",
          category: "core_cs",
          category_label: "Core CS",
          proficiency_subtitle: "Protocols, OSI & TCP/IP",
          percentage: 82,
          display_order: 15,
        },
        // Database
        {
          name: "SQL",
          category: "database",
          category_label: "Database",
          proficiency_subtitle: "Relational Queries & Schema Design",
          percentage: 90,
          display_order: 16,
        },
        // Tools
        {
          name: "Git",
          category: "tools",
          category_label: "Tools",
          percentage: 88,
          display_order: 17,
        },
        {
          name: "GitHub",
          category: "tools",
          category_label: "Tools",
          percentage: 90,
          display_order: 18,
        },
        {
          name: "VS Code",
          category: "tools",
          category_label: "Tools",
          percentage: 94,
          display_order: 19,
        },
        {
          name: "Postman",
          category: "tools",
          category_label: "Tools",
          percentage: 86,
          display_order: 20,
        },
        // Languages
        {
          name: "English",
          category: "languages",
          category_label: "Language",
          proficiency_subtitle: "Professional Working Proficiency",
          percentage: 90,
          display_order: 21,
        },
        {
          name: "Bengali",
          category: "languages",
          category_label: "Native",
          proficiency_subtitle: "Native / Mother Tongue",
          percentage: 98,
          display_order: 22,
        },
        {
          name: "Hindi",
          category: "languages",
          category_label: "Language",
          proficiency_subtitle: "Full Professional Proficiency",
          percentage: 90,
          display_order: 23,
        },
      ];

      for (const s of initialSkills) {
        await client.query(
          `INSERT INTO skills (name, category, category_label, proficiency_subtitle, percentage, display_order, is_visible)
           VALUES ($1, $2, $3, $4, $5, $6, true)`,
          [
            s.name,
            s.category,
            s.category_label,
            s.proficiency_subtitle || null,
            s.percentage,
            s.display_order,
          ],
        );
      }
      console.log(`Seeded ${initialSkills.length} initial skills.`);
    }

    // Seed Education
    const eduCheck = await client.query("SELECT COUNT(*) FROM education");
    if (parseInt(eduCheck.rows[0].count, 10) === 0) {
      const initialEdu = [
        {
          institution: "Brainware University",
          degree: "B.Tech in Computer Science & Engineering",
          stream: "Computer Science",
          start_year: "2024",
          end_year: "Present",
          grade: "8.7 CGPA",
          description:
            "Focused on building a rigorous computer science foundation, software engineering principles, modern web architecture, algorithmic thinking, and real-world system development.",
          coursework: [
            "Data Structures & Algorithms",
            "Database Management Systems",
            "Object-Oriented Programming",
            "Operating Systems",
            "Computer Networks",
            "Full Stack Web Development",
          ],
          display_order: 1,
        },
        {
          institution: "Hetia High School",
          degree: "Higher Secondary (Class 12)",
          stream: "Science Stream",
          start_year: "2022",
          end_year: "2024",
          grade: "74%",
          description:
            "Focused on Physics, Chemistry, and Mathematics (Science stream), establishing analytical, calculus, and problem-solving foundations.",
          coursework: [
            "Physics",
            "Chemistry",
            "Mathematics",
            "English",
            "Bengali",
          ],
          display_order: 2,
        },
        {
          institution: "Hetia High School",
          degree: "Secondary Education (Class 10)",
          stream: "General Science & Maths",
          start_year: "2020",
          end_year: "2022",
          grade: "66%",
          description:
            "Built early academic foundations in mathematics, physical and life sciences, and language communication.",
          coursework: [
            "Mathematics",
            "Physical Science",
            "Life Science",
            "History",
            "Geography",
          ],
          display_order: 3,
        },
      ];

      for (const e of initialEdu) {
        await client.query(
          `INSERT INTO education (institution, degree, stream, start_year, end_year, grade, description, coursework, display_order, is_visible)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)`,
          [
            e.institution,
            e.degree,
            e.stream,
            e.start_year,
            e.end_year,
            e.grade,
            e.description,
            JSON.stringify(e.coursework),
            e.display_order,
          ],
        );
      }
      console.log(`Seeded ${initialEdu.length} initial education entries.`);
    }

    // Seed Experience
    const expCheck = await client.query("SELECT COUNT(*) FROM experience");
    if (parseInt(expCheck.rows[0].count, 10) === 0) {
      const initialExp = [
        {
          company: "Brainware University",
          position: "Started My B.Tech CSE Journey",
          location: "West Bengal, India",
          start_date: "2024",
          end_date: "2024",
          currently_working: false,
          description:
            "Started my Computer Science & Engineering journey and built a foundation in programming, problem solving and computer science fundamentals.",
          technologies: ["C", "Python", "Programming Fundamentals"],
          accent_color: "purple",
          display_order: 1,
        },
        {
          company: "Self-Directed Projects",
          position: "Started Web Development",
          location: "Remote",
          start_date: "2025",
          end_date: "2025",
          currently_working: false,
          description:
            "Started building modern websites and interactive web applications while learning frontend development and JavaScript.",
          technologies: ["HTML5", "CSS3", "JavaScript", "React"],
          accent_color: "cyan",
          display_order: 2,
        },
        {
          company: "Full Stack Exploration",
          position: "Moving Into Full Stack Development",
          location: "Remote",
          start_date: "2025",
          end_date: "2026",
          currently_working: false,
          description:
            "Expanded my development skills into backend development, databases, APIs and authentication while building complete applications.",
          technologies: [
            "React",
            "Python",
            "Flask",
            "Node.js",
            "SQL",
            "MySQL",
            "REST API",
          ],
          accent_color: "indigo",
          display_order: 3,
        },
        {
          company: "Open Source & Applications",
          position: "Building Real-World Projects",
          location: "Remote",
          start_date: "2026",
          end_date: "2026",
          currently_working: false,
          description:
            "Focused on creating production-style projects, improving code quality, UI/UX, Git workflows and full-stack development practices.",
          technologies: [
            "Full Stack Development",
            "Git",
            "GitHub",
            "DSA",
            "DBMS",
            "OOP",
          ],
          accent_color: "purple",
          display_order: 4,
        },
        {
          company: "Continuous Learning & Engineering",
          position: "Learning & Preparing for the Next Step",
          location: "Remote / India",
          start_date: "2026",
          end_date: "Present",
          currently_working: true,
          description:
            "Continuously improving my technical skills, strengthening core computer science concepts and preparing for internships and full-stack development opportunities.",
          technologies: [
            "DSA",
            "Operating Systems",
            "Computer Networks",
            "System Design",
          ],
          accent_color: "emerald",
          display_order: 5,
        },
      ];

      for (const ex of initialExp) {
        await client.query(
          `INSERT INTO experience (company, position, location, start_date, end_date, currently_working, description, technologies, accent_color, display_order, is_visible)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)`,
          [
            ex.company,
            ex.position,
            ex.location,
            ex.start_date,
            ex.end_date,
            ex.currently_working,
            ex.description,
            JSON.stringify(ex.technologies),
            ex.accent_color,
            ex.display_order,
          ],
        );
      }
      console.log(`Seeded ${initialExp.length} initial experience entries.`);
    }

    // Seed Projects
    const projCheck = await client.query("SELECT COUNT(*) FROM projects");
    if (parseInt(projCheck.rows[0].count, 10) === 0) {
      const initialProjects = [
        {
          slug: "wood-furniture",
          title: "Wood Furniture",
          category: "Full Stack Web Application",
          short_description:
            "A modern, responsive e-commerce and furniture showcase platform.",
          description:
            "A modern, responsive e-commerce and furniture showcase platform featuring catalog browsing, custom product inquiries, interactive gallery, and persistent full-stack architecture.",
          image_url: "",
          technologies: [
            "React",
            "Node.js",
            "Express",
            "Tailwind CSS",
            "REST API",
            "MongoDB",
          ],
          github_url: "https://github.com/pgorai45/wood-furniture",
          live_demo_url: "",
          accent: "amber",
          preview_type: "furniture",
          display_order: 1,
          is_featured: true,
          is_published: true,
        },
        {
          slug: "hireiq",
          title: "HireIQ",
          category: "AI Resume Screening / Career Platform",
          short_description:
            "An intelligent resume analysis and career evaluation system.",
          description:
            "An intelligent resume analysis and career evaluation system that parses candidate profiles, evaluates skill relevance against job roles, and provides automated scoring insights.",
          image_url: "",
          technologies: [
            "Python",
            "Flask",
            "React",
            "NLP",
            "Tailwind CSS",
            "REST API",
          ],
          github_url: "https://github.com/pgorai45/HireIQ",
          live_demo_url: "",
          accent: "purple",
          preview_type: "resume",
          display_order: 2,
          is_featured: true,
          is_published: true,
        },
        {
          slug: "learning-assistant",
          title: "Learning Assistant",
          category: "Learning / AI Application",
          short_description:
            "An intelligent educational companion designed to streamline self-paced study.",
          description:
            "An intelligent educational companion designed to streamline self-paced study, generate topic breakdowns, clarify programming questions, and track mastery milestones.",
          image_url: "",
          technologies: [
            "React",
            "TypeScript",
            "Python",
            "AI / LLM",
            "Tailwind CSS",
          ],
          github_url: "https://github.com/pgorai45/learning-assistant",
          live_demo_url: "",
          accent: "cyan",
          preview_type: "assistant",
          display_order: 3,
          is_featured: true,
          is_published: true,
        },
        {
          slug: "flash-flood-prediction",
          title: "Flash Flood Prediction System",
          category: "AI / Machine Learning / Disaster Prediction",
          short_description:
            "A predictive machine learning system analyzing rainfall metrics and terrain telemetry.",
          description:
            "A predictive machine learning system analyzing rainfall metrics, meteorological factors, and terrain telemetry to forecast flash flood hazards for proactive early warning.",
          image_url: "",
          technologies: [
            "Python",
            "Machine Learning",
            "Data Science",
            "Flask",
            "Pandas",
          ],
          github_url:
            "https://github.com/subha117/flash-flood-prediction-system",
          live_demo_url: "",
          accent: "emerald",
          preview_type: "flood",
          display_order: 4,
          is_featured: true,
          is_published: true,
        },
        {
          slug: "quez-game",
          title: "QUEZ-GAME",
          category: "Interactive Web Application / Game",
          short_description:
            "An engaging, fast-paced trivia challenge application with dynamic question banks.",
          description:
            "An engaging, fast-paced trivia challenge application with dynamic question banks, live countdown timers, streak scoring algorithms, and a sleek gamified user interface.",
          image_url: "",
          technologies: [
            "JavaScript",
            "React",
            "Tailwind CSS",
            "Web API",
            "Interactive UI",
          ],
          github_url: "https://github.com/pgorai45/QUZE-GAME",
          live_demo_url: "",
          accent: "indigo",
          preview_type: "quiz",
          display_order: 5,
          is_featured: true,
          is_published: true,
        },
      ];

      for (const p of initialProjects) {
        await client.query(
          `INSERT INTO projects (slug, title, category, short_description, description, image_url, technologies, github_url, live_demo_url, accent, preview_type, display_order, is_featured, is_published)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
          [
            p.slug,
            p.title,
            p.category,
            p.short_description,
            p.description,
            p.image_url,
            JSON.stringify(p.technologies),
            p.github_url,
            p.live_demo_url,
            p.accent,
            p.preview_type,
            p.display_order,
            p.is_featured,
            p.is_published,
          ],
        );
      }
      console.log(`Seeded ${initialProjects.length} initial projects.`);
    }

    // Seed Resume
    const resumeCheck = await client.query("SELECT COUNT(*) FROM resumes");
    if (parseInt(resumeCheck.rows[0].count, 10) === 0) {
      await client.query(
        `INSERT INTO resumes (title, file_name, file_path, file_size, mime_type, is_active)
         VALUES ($1, $2, $3, $4, $5, true)`,
        [
          "Prasanta Gorai — Software Developer Resume",
          "Prasanta_Gorai_Resume.pdf",
          "/uploads/resumes/Prasanta_Gorai_Resume.pdf",
          123812,
          "application/pdf",
        ],
      );
      console.log("Seeded active resume entry.");
    }

    // Log initialization event
    await client.query(
      `INSERT INTO activity_logs (action, entity_type, entity_id, details)
       VALUES ('SYSTEM_INIT', 'SYSTEM', '1', 'Database tables verified and seeded successfully')`,
    );

    await client.query("COMMIT");
    console.log("Database initialized and migrated successfully!");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Database initialization failed:", error);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = initDb;

if (require.main === module) {
  initDb()
    .then(() => {
      console.log("Initialization complete.");
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
