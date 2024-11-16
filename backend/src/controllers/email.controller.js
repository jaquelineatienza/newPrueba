import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();
const codigoRes = process.env.RESEND;
const myEmail = process.env.EMAIL;
const resend = new Resend(codigoRes);

export const emails = async (req, res) => {
  const { email, body, asunto } = req.body;

  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [myEmail],
    subject: asunto,
    html: `<p>De: ${email}</p><p>${body}</p>`, // Incluye el remitente original en el contenido del correo
  });

  if (error) {
    console.error({ error });
    return res.status(500).json({ error: "Error al enviar el correo" });
  }

  console.log({ data });
  res.status(200).json({ message: "Correo enviado con éxito" });
};
async function passwordEmail(newPassword, email) {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [email],
    subject: "Reset password",
    html: `<strong>La nueva contraseña es ${newPassword}</strong>`,
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
}
export default passwordEmail;
