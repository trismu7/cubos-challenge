"use client";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginSchema } from "@/lib/formSchemas/loginSchema";
import { registerSchema } from "@/lib/formSchemas/registerSchema";
import { forgotPasswordSchema } from "@/lib/formSchemas/forgotPasswordSchema";
import { loginAction } from "@/lib/auth/login";
import { useRouter } from "next/navigation";
import { registerAction } from "@/lib/auth/register";
import { toast } from "sonner";
import { forgotPasswordAction } from "@/lib/auth/forgotPassword";

export default function AuthForm() {
  const router = useRouter();

  const [authState, setAuthState] = useState<
    "login" | "register" | "forgotPassword"
  >("login");

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function handleLoginSubmit(data: z.infer<typeof loginSchema>) {
    const { success, message } = await loginAction(data);

    if (success) {
      toast.success(message);
      router.push("/main");
    } else {
      toast.error(message);
    }
  }

  async function handleRegisterSubmit(data: z.infer<typeof registerSchema>) {
    const { success, message } = await registerAction(data);

    if (success) {
      toast.success(message);
      router.push("/main");
    } else {
      toast.error(message);
    }
  }

  async function handleForgotPasswordSubmit(
    data: z.infer<typeof forgotPasswordSchema>
  ) {
    const { success, message } = await forgotPasswordAction(data);

    if (success) {
      toast.success(message);
    } else {
      toast.error(message);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {authState === "login"
            ? "Login"
            : authState === "register"
            ? "Cadastro"
            : "Recuperação de senha"}
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full min-w-[320px] max-w-[412px]">
        {authState === "login" && (
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)}>
              <div className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="emailOrUsername"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Nome de usuário ou E-mail
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          placeholder="Digite seu nome de usuário ou e-mail"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          placeholder="Digite sua senha"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-between w-full mt-4 gap-4 items-center">
                <p
                  className="text-sm text-purple-9 underline cursor-pointer hover:text-purple-10"
                  onClick={() => setAuthState("forgotPassword")}
                >
                  Esqueci minha senha
                </p>
                <Button type="submit">Entrar</Button>
              </div>
            </form>
          </Form>
        )}

        {authState === "register" && (
          <Form {...registerForm}>
            <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)}>
              <div className="space-y-4">
                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Nome de usuário
                      </FormLabel>

                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          placeholder="Digite seu nome de usuário"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Nome</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          placeholder="Digite seu nome"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">E-mail</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          {...field}
                          placeholder="Digite seu e-mail"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          placeholder="Digite sua senha"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Confirme sua senha
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          placeholder="Confirme sua senha"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end mt-4">
                <Button className="ml-auto" type="submit">
                  Cadastrar
                </Button>
              </div>
            </form>
          </Form>
        )}

        {authState === "forgotPassword" && (
          <Form {...forgotPasswordForm}>
            <form
              onSubmit={forgotPasswordForm.handleSubmit(
                handleForgotPasswordSubmit
              )}
            >
              <div className="space-y-4">
                <FormField
                  control={forgotPasswordForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">E-mail</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          {...field}
                          placeholder="Digite seu e-mail"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-between w-full mt-4 gap-4 items-center">
                <p
                  className="text-sm text-purple-9 underline cursor-pointer hover:text-purple-10"
                  onClick={() => setAuthState("login")}
                >
                  Voltar
                </p>

                <Button type="submit">Recuperar senha</Button>
              </div>
            </form>
          </Form>
        )}

        <div className="flex justify-center w-full mt-4 border-border border-t pt-4">
          <p
            className="text-sm text-purple-9 hover:text-purple-10 cursor-pointer"
            onClick={() =>
              setAuthState(authState === "login" ? "register" : "login")
            }
          >
            {authState === "login"
              ? "Não tem uma conta? Registre-se"
              : "Já tem uma conta? Faça login"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
