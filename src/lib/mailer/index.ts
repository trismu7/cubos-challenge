import { Resend } from "resend";

// Lazy initialization to avoid build-time errors
let resend: Resend | null = null;

function getResendClient() {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY environment variable is required");
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

async function sendRecoverPasswordEmail(email: string, token: string) {
  const { error } = await getResendClient().emails.send({
    from: `noreply@${process.env.EMAIL_DOMAIN}`,
    to: email,
    subject: "Cubos Movies - Recuperar senha",
    html: `
    <h1>Cubos Movies - Recuperar senha</h1>
    <p>Clique no link abaixo para recuperar sua senha: <br />
     <a href="http://localhost:3000/recover/${token}">Recuperar senha</a></p>
    <p>Se você não solicitou a recuperação de senha, ignore este email.</p>
    `,
  });
  //public url in prod

  if (error) {
    console.error(error);
    return {
      success: false,
      message: `Erro ao enviar email de recuperação de senha para ${email}`,
    };
  }

  return {
    success: true,
    message: `Email de recuperação de senha enviado, verifique também a caixa de spam.`,
  };
}

async function sendWelcomeEmail(email: string) {
  const { error } = await getResendClient().emails.send({
    from: `noreply@${process.env.EMAIL_DOMAIN}`,
    to: email,
    subject: "Bem-vindo ao Cubos Movies",
    html: `
    <h1>Bem-vindo ao Cubos Movies</h1>
    <p>Seu cadastro foi realizado com sucesso.</p>
    <p>Você já pode fazer login e começar a salvar seus filmes favoritos.</p> 
    `,
  });

  if (error) {
    console.error(error);
    return {
      success: false,
      message: `Erro ao enviar email de boas-vindas para ${email}`,
    };
  }
}

export { sendRecoverPasswordEmail, sendWelcomeEmail };

// --- Movie release reminder ---
export async function sendMovieReleaseReminderEmail(
  email: string,
  movieTitle: string,
  releaseDateISO?: string
) {
  const prettyDate = releaseDateISO
    ? new Date(releaseDateISO).toLocaleDateString("pt-BR")
    : "hoje";

  const { error } = await getResendClient().emails.send({
    from: `noreply@${process.env.EMAIL_DOMAIN}`,
    to: email,
    subject: `Estreia hoje: ${movieTitle.toUpperCase()}`,
    html: `
      <h1>${movieTitle}</h1>
      <p>Estreia em ${prettyDate}. Aproveite!</p>
      <p>— Cubos Movies</p>
    `,
  });

  if (error) {
    console.error(error);
    return {
      success: false,
      message: `Erro ao enviar email de estreia para ${email}`,
    };
  }

  return { success: true };
}
