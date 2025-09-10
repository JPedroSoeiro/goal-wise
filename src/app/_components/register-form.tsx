// src/app/_components/register-form.tsx
"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { registerUser } from "@/services/users/usersService";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

// CORREÇÃO: Desestruture 'onSwitchToLogin' aqui para separá-lo do ...props
export function RegisterForm({
  className,
  onSwitchToLogin,
  ...props
}: React.ComponentProps<"div"> & {
  onSwitchToLogin?: () => void;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      await registerUser({
        name: fullName,
        email,
        password,
      });

      const signInResult = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInResult?.ok) {
        setMessage({
          type: "success",
          text: "Registro bem-sucedido! Redirecionando...",
        });
        router.refresh();
      } else {
        setMessage({
          type: "error",
          text:
            signInResult?.error || "Falha no login automático após o registro.",
        });
      }
    } catch (error: any) {
      console.error("Erro durante o registro:", error);
      setMessage({
        type: "error",
        text: error.message || "Falha no registro. Por favor, tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* O `...props` passado para o Card agora não contém mais o onSwitchToLogin */}
      <Card className={cn("overflow-hidden", className)} {...props}>
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleRegister}>
            <div className="flex flex-col gap-6">
              {/* Conteúdo do formulário... */}
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Crie sua conta</h1>
                <p className="text-balance text-muted-foreground">
                  Comece sua jornada hoje
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fullName">Nome Completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Seu nome"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  "Registrar"
                )}
              </Button>
              {message && (
                <div
                  className={`text-sm font-medium ${
                    message.type === "success"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {message.text}
                </div>
              )}
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Ou continue com
                </span>
              </div>

              <div className="text-center text-sm">
                Já tem uma conta?{" "}
                <a
                  onClick={onSwitchToLogin}
                  className="underline underline-offset-4 cursor-pointer"
                >
                  Entrar
                </a>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/soccer.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale bg-text-white"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        Ao clicar em continuar, você concorda com nossos{" "}
        <a href="#">Termos de Serviço</a> e{" "}
        <a href="#">Política de Privacidade</a>.
      </div>
    </>
  );
}
