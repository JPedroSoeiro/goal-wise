// src/app/_components/register.tsx
"use client";

import type React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase"; // Importe o cliente Supabase
import { signIn } from "next-auth/react"; // Importe signIn

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName, // Exemplo de metadados adicionais
          },
        },
      });

      if (error) {
        setMessage({
          type: "error",
          text:
            error.message || "Falha no registro. Por favor, tente novamente.",
        });
        return;
      }

      if (data.user) {
        setMessage({
          type: "success",
          text: "Registro bem-sucedido! Redirecionando para login...",
        });
        // Tenta logar o usuário automaticamente após o registro
        await signIn("credentials", {
          redirect: false,
          email,
          password,
        });
        // Após o registro e login, você pode redirecionar o usuário
        setTimeout(() => {
          window.location.href = "/dashboard"; // Redireciona para o dashboard
        }, 1500);
      } else {
        setMessage({
          type: "success",
          text: "Registro bem-sucedido! Verifique seu e-mail para confirmar a conta.",
        });
      }

      // Reset form
      setFullName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Erro durante o registro:", error);
      setMessage({
        type: "error",
        text: "Falha no registro. Por favor, tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Registrar</CardTitle>
        <CardDescription>Crie uma nova conta para começar</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome Completo</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Insira seu nome completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Insira seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Insira sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700"
            disabled={isLoading}
          >
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
                message.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {message.text}
            </div>
          )}
          <div className="text-center text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <a href="/" className="text-primary hover:underline">
              Entrar aqui
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default Register;
