import type {
  AdminUser,
  PortfolioProfile,
  Skill,
  Education,
  Experience,
  Project,
  Resume,
  ContactMessage,
  Appointment,
  DashboardStats,
  ApiResponse,
} from "../types/admin";

const TOKEN_KEY = "portfolio_admin_token";

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

// Base fetch helper with token and error handling
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  isAuthRequired = false
): Promise<ApiResponse<T>> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (isAuthRequired && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({
      success: false,
      message: `Failed to parse response: ${response.statusText}`,
    }));

    if (response.status === 401 && isAuthRequired) {
      removeStoredToken();
      // Only redirect if currently on an admin route
      if (window.location.pathname.startsWith("/admin") && !window.location.pathname.includes("/admin/login")) {
        window.location.href = "/admin/login?expired=1";
      }
    }

    if (!response.ok && !data.message) {
      data.message = `HTTP ${response.status}: ${response.statusText}`;
    }

    return data;
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Network error or server unreachable";
    return {
      success: false,
      message: msg,
    };
  }
}

// ==========================================
// PUBLIC PORTFOLIO APIs
// ==========================================
export const portfolioApi = {
  getProfile: () => request<PortfolioProfile>("/api/portfolio/profile"),
  getSkills: () => request<Skill[]>("/api/portfolio/skills"),
  getEducation: () => request<Education[]>("/api/portfolio/education"),
  getExperience: () => request<Experience[]>("/api/portfolio/experience"),
  getProjects: () => request<Project[]>("/api/portfolio/projects"),
  getResume: () => request<Resume>("/api/portfolio/resume"),
  submitContact: (data: { name: string; email: string; message: string; subject?: string }) =>
    request<ContactMessage>("/api/contact", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  submitAppointment: (data: { name: string; email: string; date: string; time: string; message?: string }) =>
    request<Appointment>("/api/appointments", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ==========================================
// ADMIN PORTAL APIs
// ==========================================
export const adminApi = {
  // Auth
  login: (email: string, password: string) =>
    request<{ token: string; admin: AdminUser }>("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  logout: () =>
    request<{ message: string }>("/api/admin/logout", { method: "POST" }, true),
  getMe: () =>
    request<AdminUser>("/api/admin/me", { method: "GET" }, true),
  updateSettings: (data: { username?: string; email?: string; currentPassword?: string; newPassword?: string }) =>
    request<{ admin: AdminUser }>("/api/admin/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    }, true),

  // Stats
  getStats: () =>
    request<DashboardStats>("/api/admin/stats", { method: "GET" }, true),

  // Profile
  getProfile: () =>
    request<PortfolioProfile>("/api/admin/profile", { method: "GET" }, true),
  updateProfile: (data: Partial<PortfolioProfile>) =>
    request<PortfolioProfile>("/api/admin/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }, true),

  // Skills
  getSkills: (category?: string, search?: string) => {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (search) params.append("search", search);
    return request<Skill[]>(`/api/admin/skills?${params.toString()}`, { method: "GET" }, true);
  },
  createSkill: (data: Omit<Skill, "id" | "created_at" | "updated_at">) =>
    request<Skill>("/api/admin/skills", {
      method: "POST",
      body: JSON.stringify(data),
    }, true),
  updateSkill: (id: number, data: Partial<Skill>) =>
    request<Skill>(`/api/admin/skills/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }, true),
  deleteSkill: (id: number) =>
    request<{ message: string }>(`/api/admin/skills/${id}`, { method: "DELETE" }, true),
  reorderSkills: (items: { id: number; display_order: number }[]) =>
    request<{ message: string }>("/api/admin/skills/reorder", {
      method: "PATCH",
      body: JSON.stringify({ items }),
    }, true),

  // Education
  getEducation: (search?: string) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    return request<Education[]>(`/api/admin/education?${params.toString()}`, { method: "GET" }, true);
  },
  createEducation: (data: Omit<Education, "id" | "created_at" | "updated_at">) =>
    request<Education>("/api/admin/education", {
      method: "POST",
      body: JSON.stringify(data),
    }, true),
  updateEducation: (id: number, data: Partial<Education>) =>
    request<Education>(`/api/admin/education/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }, true),
  deleteEducation: (id: number) =>
    request<{ message: string }>(`/api/admin/education/${id}`, { method: "DELETE" }, true),

  // Experience
  getExperience: (search?: string) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    return request<Experience[]>(`/api/admin/experience?${params.toString()}`, { method: "GET" }, true);
  },
  createExperience: (data: Omit<Experience, "id" | "created_at" | "updated_at">) =>
    request<Experience>("/api/admin/experience", {
      method: "POST",
      body: JSON.stringify(data),
    }, true),
  updateExperience: (id: number, data: Partial<Experience>) =>
    request<Experience>(`/api/admin/experience/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }, true),
  deleteExperience: (id: number) =>
    request<{ message: string }>(`/api/admin/experience/${id}`, { method: "DELETE" }, true),

  // Projects
  getProjects: (filters?: { search?: string; category?: string; status?: string }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.category) params.append("category", filters.category);
    if (filters?.status) params.append("status", filters.status);
    return request<Project[]>(`/api/admin/projects?${params.toString()}`, { method: "GET" }, true);
  },
  createProject: (data: Omit<Project, "id" | "created_at" | "updated_at">) =>
    request<Project>("/api/admin/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }, true),
  updateProject: (id: number, data: Partial<Project>) =>
    request<Project>(`/api/admin/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }, true),
  deleteProject: (id: number) =>
    request<{ message: string }>(`/api/admin/projects/${id}`, { method: "DELETE" }, true),
  togglePublishProject: (id: number) =>
    request<Project>(`/api/admin/projects/${id}/publish`, { method: "PATCH" }, true),
  toggleFeatureProject: (id: number) =>
    request<Project>(`/api/admin/projects/${id}/feature`, { method: "PATCH" }, true),

  // Resumes
  getResumes: () =>
    request<Resume[]>("/api/admin/resumes", { method: "GET" }, true),
  uploadResume: (formData: FormData) =>
    request<Resume>("/api/admin/resume", {
      method: "POST",
      body: formData,
    }, true),
  setActiveResume: (id: number) =>
    request<Resume>(`/api/admin/resume/${id}/active`, { method: "PUT" }, true),
  deleteResume: (id: number) =>
    request<{ message: string }>(`/api/admin/resume/${id}`, { method: "DELETE" }, true),

  // Contacts
  getContacts: (filters?: { search?: string; status?: string; sort?: string; page?: number; limit?: number }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.sort) params.append("sort", filters.sort);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.limit) params.append("limit", String(filters.limit));
    return request<ContactMessage[]>(`/api/admin/contacts?${params.toString()}`, { method: "GET" }, true);
  },
  toggleContactRead: (id: number, is_read?: boolean) =>
    request<ContactMessage>(`/api/admin/contacts/${id}/read`, {
      method: "PATCH",
      body: JSON.stringify({ is_read }),
    }, true),
  deleteContact: (id: number) =>
    request<{ message: string }>(`/api/admin/contacts/${id}`, { method: "DELETE" }, true),

  // Appointments
  getAppointments: (filters?: { search?: string; status?: string; sort?: string; page?: number; limit?: number }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.sort) params.append("sort", filters.sort);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.limit) params.append("limit", String(filters.limit));
    return request<Appointment[]>(`/api/admin/appointments?${params.toString()}`, { method: "GET" }, true);
  },
  updateAppointmentStatus: (id: number, status: "pending" | "confirmed" | "cancelled") =>
    request<Appointment>(`/api/admin/appointments/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }, true),
  deleteAppointment: (id: number) =>
    request<{ message: string }>(`/api/admin/appointments/${id}`, { method: "DELETE" }, true),

  // Image Upload
  uploadImage: (formData: FormData) =>
    request<{ url: string; fileName: string }>("/api/admin/upload/image", {
      method: "POST",
      body: formData,
    }, true),
};
