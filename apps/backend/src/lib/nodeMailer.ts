import nodemailer from "nodemailer";
import { appConfig } from "../config/appConfig";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: appConfig.SMTP_USER,
    pass: appConfig.SMTP_PASS,
  },
});

type EmailType = "signup" | "forget-password";

const getEmailSubject = (emailType: EmailType) => {
  if (emailType === "signup") {
    return "Confirm your account - Chimu Sync";
  } else if (emailType === "forget-password") {
    return "Reset your password - Chimu Sync";
  } else {
    return "Notification from Chimu Sync";
  }
};

const getEmailText = (emailType: EmailType, name: string, link: string) => {
  if (emailType === "signup") {
    return `Welcome to Chimu Sync, ${name}!\n\nPlease confirm your account by clicking the link below:\n${link}\n\nIf you did not sign up, you can ignore this email.\n\nThanks,\nThe Chimu Sync Team`;
  } else if (emailType === "forget-password") {
    return `Hi ${name},\n\nIt looks like you requested a password reset. Click the link below to reset your password:\n${link}\n\nIf you didn't request this, please ignore this email.\n\nThanks,\nThe Chimu Sync Team`;
  }
  return "";
};

const getEmailHtml = (emailType: EmailType, name: string, link: string) => {
  if (emailType === "signup") {
    return `
      <div style="max-width:480px;margin:auto;border-radius:10px;border:1px solid #e5e7eb;background:#fff;padding:32px 24px;font-family:ui-sans-serif,system-ui,sans-serif;box-shadow:0 4px 24px rgba(0,0,0,0.04)">
        <p style="margin:0 0 20px;font-size:14px;font-weight:600;color:#09090b;letter-spacing:0.02em;">Chimu Sync</p>
        <h2 style="margin:0 0 16px;color:#0a0a0a;font-size:22px;">Welcome, ${name}!</h2>
        <p style="margin-bottom:20px;color:#4a4a4a;font-size:16px;line-height:1.5;">
          Thanks for signing up! Please confirm your email to get started.
        </p>
        <a href="${link}" style="display:inline-block;background:#09090b;color:#fafafa;padding:12px 32px;border-radius:8px;margin:16px 0;text-decoration:none;font-weight:600;font-size:16px;box-shadow:0 1px 2px rgba(0,0,0,0.18);letter-spacing:0.02em;">
          Confirm Account
        </a>
        <p style="margin-top:32px;font-size:12px;color:#8e99a7;">
          If you did not create this account, you can safely ignore this email.
        </p>
      </div>
    `;
  } else if (emailType === "forget-password") {
    return `
      <div style="max-width:480px;margin:auto;border-radius:10px;border:1px solid #e5e7eb;background:#fff;padding:32px 24px;font-family:ui-sans-serif,system-ui,sans-serif;box-shadow:0 4px 24px rgba(0,0,0,0.04)">
        <p style="margin:0 0 20px;font-size:14px;font-weight:600;color:#09090b;letter-spacing:0.02em;">Chimu Sync</p>
        <h2 style="margin:0 0 16px;color:#0a0a0a;font-size:22px;">Reset your password, ${name}</h2>
        <p style="margin-bottom:20px;color:#4a4a4a;font-size:16px;line-height:1.5;">
          We received a request to reset your password. Click the button below to set up a new password.
        </p>
        <a href="${link}" style="display:inline-block;background:#09090b;color:#fafafa;padding:12px 32px;border-radius:8px;margin:16px 0;text-decoration:none;font-weight:600;font-size:16px;box-shadow:0 1px 2px rgba(0,0,0,0.18);letter-spacing:0.02em;">
          Reset Password
        </a>
        <p style="margin-top:32px;font-size:12px;color:#8e99a7;">
          If you didn't request a password reset, no further action is required.
        </p>
      </div>
    `;
  }
  return "";
};

export const sendEmail = async (
  to: string,
  emailType: EmailType,
  name: string,
  link: string,
) => {
  await transporter.sendMail({
    from: appConfig.MAIL_FROM,
    to,
    subject: getEmailSubject(emailType),
    text: getEmailText(emailType, name, link),
    html: getEmailHtml(emailType, name, link),
  });
};
