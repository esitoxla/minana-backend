import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ name, email, message }) => {
  try {
    const response = await resend.emails.send({
      from: "your-domain@resend.dev", // Use a verified sender address or domain
      to: "recipient@example.com", // The actual business email
      subject: "New Contact Message",
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong> ${message}</p>`,
    });

    return response;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};
