"use server";
import { db } from "@/db";
import Link from "next/link";
import RecoverPasswordForm from "@/lib/mailer/RecoverPasswordForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function RecoverPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const recoverPasswordToken = await db.recoverPasswordToken.findFirst({
    where: {
      token,
    },
    include: {
      user: true,
    },
  });

  if (!recoverPasswordToken) {
    return (
      <div className="grid place-items-center h-screen w-screen">
        <h1 className="text-2xl font-bold">Token inválido</h1>
        <p className="text-sm text-gray-500">
          O token de recuperação de senha é inválido ou expirou.
        </p>
        <Link href="/login" className="text-sm text-blue-500">
          Voltar para a página de login
        </Link>
      </div>
    );
  }

  return (
    <div className="grid place-items-center h-screen w-screen">
      <Card>
        <CardHeader>
          <CardTitle>Recuperar senha</CardTitle>
        </CardHeader>
        <CardContent>
          <RecoverPasswordForm token={token} />
        </CardContent>
      </Card>
    </div>
  );
}
