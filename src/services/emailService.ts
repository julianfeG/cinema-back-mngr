import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

interface EmailParams {
    to: string;
    from: string;
    templateId: string;
    dynamicTemplateData: Record<string, any>;
  }

  export const sendEmail = async (params: EmailParams): Promise<void> => {
    console.log("Init to sendEmail with these params: ", params);
    const msg = {
      to: params.to,
      from: params.from,
      templateId: params.templateId,
      subject: '¡Gracias por tu reserva!',
      dynamicTemplateData: params.dynamicTemplateData,
    } as any;
  
    try {
      await sgMail.send(msg);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  };
  
  
