import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

interface EmailParams {
    to: string;
    from: string;
    templateId: string;
    dynamicTemplateData: Record<string, any>;
  }

export const sendEmail = (params: EmailParams): void => {
const msg = {
    to: params.to,
    from: params.from,
    templateId: params.templateId,
    dynamicTemplateData: params.dynamicTemplateData
} as any;

sgMail.send(msg)
    .then(() => console.log("Email sent successfully"))
    .catch((error) => console.error("Error sending email:", error));
};
  
