export interface ProjectItem {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  githubUrl: string;
  accent: "amber" | "purple" | "cyan" | "emerald" | "indigo";
  previewType: "furniture" | "resume" | "assistant" | "flood" | "quiz";
}

export const FEATURED_PROJECTS: ProjectItem[] = [
  {
    id: "wood-furniture",
    number: "01",
    title: "Wood Furniture",
    category: "Full Stack Web Application",
    description:
      "A modern, responsive e-commerce and furniture showcase platform featuring catalog browsing, custom product inquiries, interactive gallery, and persistent full-stack architecture.",
    tags: ["React", "Node.js", "Express", "Tailwind CSS", "REST API", "MongoDB"],
    githubUrl: "https://github.com/pgorai45/wood-furniture",
    accent: "amber",
    previewType: "furniture",
  },
  {
    id: "hireiq",
    number: "02",
    title: "HireIQ",
    category: "AI Resume Screening / Career Platform",
    description:
      "An intelligent resume analysis and career evaluation system that parses candidate profiles, evaluates skill relevance against job roles, and provides automated scoring insights.",
    tags: ["Python", "Flask", "React", "NLP", "Tailwind CSS", "REST API"],
    githubUrl: "https://github.com/pgorai45/HireIQ",
    accent: "purple",
    previewType: "resume",
  },
  {
    id: "learning-assistant",
    number: "03",
    title: "Learning Assistant",
    category: "Learning / AI Application",
    description:
      "An intelligent educational companion designed to streamline self-paced study, generate topic breakdowns, clarify programming questions, and track mastery milestones.",
    tags: ["React", "TypeScript", "Python", "AI / LLM", "Tailwind CSS"],
    githubUrl: "https://github.com/pgorai45/learning-assistant",
    accent: "cyan",
    previewType: "assistant",
  },
  {
    id: "flash-flood-prediction",
    number: "04",
    title: "Flash Flood Prediction System",
    category: "AI / Machine Learning / Disaster Prediction",
    description:
      "A predictive machine learning system analyzing rainfall metrics, meteorological factors, and terrain telemetry to forecast flash flood hazards for proactive early warning.",
    tags: ["Python", "Machine Learning", "Data Science", "Flask", "Pandas"],
    githubUrl: "https://github.com/subha117/flash-flood-prediction-system",
    accent: "emerald",
    previewType: "flood",
  },
  {
    id: "quez-game",
    number: "05",
    title: "QUEZ-GAME",
    category: "Interactive Web Application / Game",
    description:
      "An engaging, fast-paced trivia challenge application with dynamic question banks, live countdown timers, streak scoring algorithms, and a sleek gamified user interface.",
    tags: ["JavaScript", "React", "Tailwind CSS", "Web API", "Interactive UI"],
    githubUrl: "https://github.com/pgorai45/QUZE-GAME",
    accent: "indigo",
    previewType: "quiz",
  },
];
