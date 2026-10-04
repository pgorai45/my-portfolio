export interface AdminUser {
  id: number;
  email: string;
  username: string;
  role: string;
  created_at?: string;
  updated_at?: string;
}

export interface PortfolioProfile {
  id?: number;
  name: string;
  title: string;
  bio?: string;
  about_intro?: string;
  about_details?: string;
  profile_image?: string;
  location?: string;
  email?: string;
  phone?: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  website_url?: string;
  available_for_work?: boolean;
  is_visible?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  category_label?: string;
  proficiency_subtitle?: string;
  percentage: number;
  display_order: number;
  is_visible: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  stream?: string;
  start_year: string;
  end_year?: string;
  grade?: string;
  description?: string;
  coursework?: string[] | string;
  display_order: number;
  is_visible: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Experience {
  id: number;
  company: string;
  position: string;
  location?: string;
  start_date: string;
  end_date?: string;
  currently_working: boolean;
  description?: string;
  technologies?: string[] | string;
  accent_color?: "purple" | "cyan" | "indigo" | "emerald";
  display_order: number;
  is_visible: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: number;
  slug?: string;
  title: string;
  category: string;
  short_description?: string;
  description: string;
  image_url?: string;
  technologies?: string[] | string;
  github_url?: string;
  live_demo_url?: string;
  accent?: "amber" | "purple" | "cyan" | "emerald" | "indigo";
  preview_type?: "furniture" | "resume" | "assistant" | "flood" | "quiz";
  display_order: number;
  is_featured: boolean;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Resume {
  id: number;
  title: string;
  file_name: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Appointment {
  id: number;
  name: string;
  email: string;
  date: string;
  time: string;
  message?: string;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
  updated_at?: string;
}

export interface ActivityLog {
  id: number;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: string;
  ip_address?: string;
  created_at: string;
}

export interface DashboardStats {
  counts: {
    totalProjects: number;
    totalSkills: number;
    totalEducation: number;
    totalExperience: number;
    totalContacts: number;
    totalAppointments: number;
    pendingAppointments: number;
    unreadContacts: number;
  };
  recentContacts: ContactMessage[];
  recentAppointments: Appointment[];
  recentChanges: ActivityLog[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
