"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  recoverPasswordSchema,
  RegisterFormData,
} from "@/lib/formSchemas/recoverPasswordSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { recoverPasswordAction } from "../auth/recoverPassword";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
export default function RecoverPasswordForm({ token }: { token: string }) {
  const router = useRouter();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(recoverPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    const { success, message } = await recoverPasswordAction(token, data);
    if (success) {
      toast.success(message + " Faça login para continuar");

      router.push("/login");
    } else {
      toast.error(message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar senha</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end items-center gap-4">
          {/* <Link href="/login" className="text-sm">
            Cancelar
          </Link> */}
          <Button type="submit">Atualizar senha</Button>
        </div>
      </form>
    </Form>
  );
}
