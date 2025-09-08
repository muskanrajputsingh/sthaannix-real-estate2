// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export const sendOTP = async (to: string, otp: string) => {
//   try {
//     const mailoptions = {
//       from: `Sthaanix Real Estate <${process.env.EMAIL_USER}>`,
//       to,
//       subject: "Your OTP Code",
//       text: `Your OTP is ${otp}`,
//       html: `<p>Your OTP code is: <b>${otp}</b></p>`,
//     };

//     const info = await transporter.sendMail(mailoptions);
//     console.log("OTP sent: %s", info.messageId);
//   } catch (error) {
//     console.error("Error sending OTP:", error);
//     throw new Error("Failed to send OTP");
//   }
// };

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export const sendEmail = async (options: EmailOptions) => {
  try {
    const mailOptions = {
      from: `Sthaanix Real Estate <${process.env.EMAIL_USER}>`,
      ...options,
    };

    const info = await transporter.sendMail(mailOptions);
    // console.log("Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

export const sendOTP = async (to: string, otp: string, purpose: string) => {
  if (purpose === "passwordReset") {
    return sendEmail({
      to,
      subject: "Password Reset OTP",
      text: `Your password reset OTP is ${otp}. It will expire in 10 minutes.`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2d3748;">Password Reset Request</h2>
        <p>We received a request to reset your password. Your OTP code is:</p>
        <div style="background: #f7fafc; padding: 16px; border-radius: 4px; 
                    font-size: 24px; font-weight: bold; color: #2d3748; 
                    text-align: center; margin: 16px 0;">
          ${otp}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p style="color: #718096; font-size: 12px;">
          If you didn't request a password reset, you can safely ignore this email.
        </p>
      </div>
    `,
    });
  } else {
    return sendEmail({
      to,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2d3748;">Sthaanix Account Verification</h2>
        <p>Your OTP code is:</p>
        <div style="background: #f7fafc; padding: 16px; border-radius: 4px; 
                    font-size: 24px; font-weight: bold; color: #2d3748; 
                    text-align: center; margin: 16px 0;">
          ${otp}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p style="color: #718096; font-size: 12px;">
          If you didn't request this, please ignore this email.
        </p>
      </div>
    `,
    });
  }
};

export const sendLeadNotification = async (
  to: string,
  leadData: {
    propertyTitle: string;
    buyerName: string | undefined;
    buyerEmail: string | undefined;
    message?: string;
    price: number;
  }
) => {
  return sendEmail({
    to,
    subject: `New Lead for ${leadData.propertyTitle}`,
    text: `You have a new lead from ${leadData.buyerName} for property ${leadData.propertyTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2d3748;">New Property Lead</h2>
        <p>You've received a new enquiry for your property:</p>
        
        <div style="background: #f7fafc; padding: 16px; border-radius: 4px; margin: 16px 0;">
          <h3 style="margin-top: 0;">${leadData.propertyTitle}</h3>
          <p><strong>Price:</strong> ₹${leadData.price.toLocaleString()}</p>
          <p><strong>Name:</strong> ${leadData.buyerName}</p>
          <p><strong>From:</strong> ${leadData.buyerEmail}</p>
          ${leadData.message ? `<p><strong>Message:</strong> ${leadData.message}</p>` : ""}
        </div>
                
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
          <a href="${process.env.FRONTEND_URL}/dashboard/leads" 
             style="background: #4299e1; color: white; padding: 8px 16px; 
                    text-decoration: none; border-radius: 4px;">
            View Lead in Dashboard
          </a>
        </div>
      </div>
    `,
  });
};

export const sendLeadStatusUpdate = async (
  to: string,
  updateData: {
    propertyTitle: string;
    status: string;
    responseMessage?: string;
  }
) => {
  return sendEmail({
    to,
    subject: `Lead Status Updated for ${updateData.propertyTitle}`,
    text: `The status of your lead for ${updateData.propertyTitle} has been updated to ${updateData.status}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2d3748;">Lead Status Updated</h2>
        <p>Your enquiry for the property below has been updated:</p>
        
        <div style="background: #f7fafc; padding: 16px; border-radius: 4px; margin: 16px 0;">
          <h3 style="margin-top: 0;">${updateData.propertyTitle}</h3>
          <p><strong>New Status:</strong> ${updateData.status}</p>
          ${updateData.responseMessage ? `<p><strong>Owner's Response:</strong> ${updateData.responseMessage}</p>` : ""}
        </div>
        
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
          <a href="${process.env.FRONTEND_URL}/dashboard/leads" 
             style="background: #4299e1; color: white; padding: 8px 16px; 
                    text-decoration: none; border-radius: 4px;">
            View Your Leads
          </a>
        </div>
      </div>
    `,
  });
};

export const sendPaymentConfirmation = async (
  to: string,
  paymentData: {
    amount: number;
    purpose: string;
    transactionId: string;
  }
) => {
  return sendEmail({
    to,
    subject: `Payment Received - ${paymentData.purpose}`,
    text: `We've received your payment of ₹${paymentData.amount} for ${paymentData.purpose}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2d3748;">Payment Confirmation</h2>
        <p>Thank you for your payment. Here are the details:</p>
        
        <div style="background: #f7fafc; padding: 16px; border-radius: 4px; margin: 16px 0;">
          <p><strong>Amount:</strong> ₹${paymentData.amount.toLocaleString()}</p>
          <p><strong>Purpose:</strong> ${paymentData.purpose}</p>
          <p><strong>Transaction ID:</strong> ${paymentData.transactionId}</p>
          <p><strong>Status:</strong> Pending Approval</p>
        </div>
        
        <p>Your payment is under review. You'll receive another email once it's approved.</p>
        
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
          <a href="${process.env.FRONTEND_URL}/dashboard/payments" 
             style="background: #4299e1; color: white; padding: 8px 16px; 
                    text-decoration: none; border-radius: 4px;">
            View Payment Status
          </a>
        </div>
      </div>
    `,
  });
};

// Add this new function to your Node.js file
export const sendContactFormMessage = async (formData: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) => {
  return sendEmail({
    to: process.env.BUSINESS_EMAIL ?? "default@email.com", 
    subject: `New Contact Form Message from ${formData.name}`,
    text: `You have a new message from a contact form.
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || "Not provided"}
Message: ${formData.message}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
        <h2 style="color: #2d3748;">New Contact Form Submission</h2>
        <p>You have a new message from your website's contact form. Here are the details:</p>
        
        <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 24px 0;">
          <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${formData.name}</p>
          <p style="margin: 0 0 10px 0;"><strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a></p>
          <p style="margin: 0 0 10px 0;"><strong>Phone:</strong> ${formData.phone || "Not provided"}</p>
          <p style="margin: 0 0 0 0;"><strong>Message:</strong></p>
          <p style="margin-top: 5px; padding-left: 10px; border-left: 2px solid #cbd5e0;">${formData.message}</p>
        </div>
        
        <p style="font-size: 14px; color: #718096;">Sthaanix Contact Form System</p>
      </div>
    `,
  });
};
