import emailjs from "@emailjs/browser";

export const TARGET_EMAIL = "prasantagorai.dev@gmail.com";

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface AppointmentBookingData {
  name: string;
  email: string;
  appointment_date: string;
  appointment_time: string;
  duration?: string;
  timezone?: string;
  status?: string;
  notes?: string;
}

export interface SendEmailResponse {
  success: boolean;
  message?: string;
  error?: string;
  isConfigurationError?: boolean;
}

/**
 * Validates EmailJS environment configuration for general contact messages.
 */
export function getEmailJSConfig() {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID?.trim();
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID?.trim();
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.trim();

  const isConfigured = Boolean(
    serviceId &&
    templateId &&
    publicKey &&
    serviceId !== "your_service_id_here" &&
    templateId !== "your_template_id_here" &&
    publicKey !== "your_public_key_here"
  );

  return {
    serviceId,
    templateId,
    publicKey,
    isConfigured,
  };
}

/**
 * Validates EmailJS environment configuration for appointment confirmations.
 * Uses VITE_EMAILJS_APPOINTMENT_TEMPLATE_ID if set, otherwise falls back to VITE_EMAILJS_TEMPLATE_ID.
 */
export function getEmailJSAppointmentConfig() {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID?.trim();
  const appointmentTemplateId = import.meta.env.VITE_EMAILJS_APPOINTMENT_TEMPLATE_ID?.trim();
  const fallbackTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID?.trim();
  const templateId = appointmentTemplateId || fallbackTemplateId;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.trim();

  const isConfigured = Boolean(
    serviceId &&
    templateId &&
    publicKey &&
    serviceId !== "your_service_id_here" &&
    templateId !== "your_template_id_here" &&
    templateId !== "your_appointment_template_id_here" &&
    publicKey !== "your_public_key_here"
  );

  return {
    serviceId,
    templateId,
    publicKey,
    isConfigured,
  };
}

/**
 * Sends a contact message via EmailJS to prasantagorai.dev@gmail.com.
 */
export async function sendContactMessage(data: ContactFormData): Promise<SendEmailResponse> {
  const { serviceId, templateId, publicKey, isConfigured } = getEmailJSConfig();

  if (!isConfigured || !serviceId || !templateId || !publicKey) {
    return {
      success: false,
      isConfigurationError: true,
      error:
        "EmailJS credentials are not configured yet. Please configure VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY in your environment.",
    };
  }

  // Template parameters for broad template compatibility
  const templateParams: Record<string, unknown> = {
    // Standard parameter names
    name: data.name.trim(),
    email: data.email.trim(),
    message: data.message.trim(),
    // Alternative parameter names used by common EmailJS presets
    from_name: data.name.trim(),
    from_email: data.email.trim(),
    user_name: data.name.trim(),
    user_email: data.email.trim(),
    reply_to: data.email.trim(),
    to_name: "Prasanta Gorai",
    to_email: TARGET_EMAIL,
    recipient_email: TARGET_EMAIL,
  };

  try {
    const result = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    );

    if (result.status === 200 || result.text === "OK") {
      return {
        success: true,
        message: "Message sent successfully!",
      };
    }

    return {
      success: false,
      error: result.text || "Failed to send message. Please try again.",
    };
  } catch (error: unknown) {
    let errorDetail = "Failed to send message. Please try again.";

    if (error && typeof error === "object") {
      if ("text" in error && typeof (error as { text: unknown }).text === "string") {
        errorDetail = (error as { text: string }).text;
      } else if ("message" in error && typeof (error as { message: unknown }).message === "string") {
        errorDetail = (error as { message: string }).message;
      }
    }

    return {
      success: false,
      error: errorDetail,
    };
  }
}

/**
 * Sends an appointment booking confirmation notification to host with visitor details.
 */
export async function sendAppointmentConfirmationEmail(
  data: AppointmentBookingData
): Promise<SendEmailResponse> {
  const { serviceId, templateId, publicKey, isConfigured } = getEmailJSAppointmentConfig();

  if (!isConfigured || !serviceId || !templateId || !publicKey) {
    return {
      success: false,
      isConfigurationError: true,
      error:
        "EmailJS credentials are not configured yet. Please configure VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_APPOINTMENT_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY in your environment.",
    };
  }

  const visitorEmail = data.email.trim();
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(visitorEmail);

  // Template variables specified by user:
  // {{name}}, {{email}}, {{appointment_date}}, {{appointment_time}}, {{duration}}, {{timezone}}, {{status}}
  // with visitor's email set as Reply-To
  const templateParams: Record<string, unknown> = {
    name: data.name.trim(),
    email: visitorEmail,
    appointment_date: data.appointment_date,
    appointment_time: data.appointment_time,
    duration: data.duration || "15 minutes",
    timezone: data.timezone || "IST (GMT+5:30)",
    status: data.status || "Confirmed",
    reply_to: isEmail ? visitorEmail : TARGET_EMAIL,
    // Supporting additional aliases for template flexibility
    from_name: data.name.trim(),
    from_email: isEmail ? visitorEmail : TARGET_EMAIL,
    user_name: data.name.trim(),
    user_email: visitorEmail,
    to_name: "Prasanta Gorai",
    to_email: TARGET_EMAIL,
    recipient_email: TARGET_EMAIL,
    notes: data.notes?.trim() || "None",
  };

  try {
    const result = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    );

    if (result.status === 200 || result.text === "OK") {
      return {
        success: true,
        message: "Appointment confirmation email sent successfully!",
      };
    }

    return {
      success: false,
      error: result.text || "Failed to send appointment confirmation email.",
    };
  } catch (error: unknown) {
    let errorDetail = "Failed to send appointment confirmation email.";

    if (error && typeof error === "object") {
      if ("text" in error && typeof (error as { text: unknown }).text === "string") {
        errorDetail = (error as { text: string }).text;
      } else if ("message" in error && typeof (error as { message: unknown }).message === "string") {
        errorDetail = (error as { message: string }).message;
      }
    }

    return {
      success: false,
      error: errorDetail,
    };
  }
}

/**
 * Generates a fallback mailto: link prefilled with recipient, subject, and body.
 */
export function getMailtoFallbackLink(data: Partial<ContactFormData>): string {
  const subject = encodeURIComponent(
    data.name ? `Portfolio Contact: Message from ${data.name}` : "Portfolio Contact Inquiry"
  );
  const body = encodeURIComponent(
    `Name: ${data.name || ""}\nEmail: ${data.email || ""}\n\nMessage:\n${data.message || ""}`
  );
  return `mailto:${TARGET_EMAIL}?subject=${subject}&body=${body}`;
}
