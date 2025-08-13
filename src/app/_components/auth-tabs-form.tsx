"use client";

import * as React from "react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./login-form"; // Certifique-se de que este caminho está correto
import { RegisterForm } from "./register-form"; // Certifique-se de que este caminho está correto

export function AuthTabsForm() {
  const [activeTab, setActiveTab] = useState("login");

  const handleSwitchToRegister = () => {
    setActiveTab("register");
  };

  const handleSwitchToLogin = () => {
    setActiveTab("login");
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[1000px]">
      <TabsContent value="login">
        <LoginForm onSwitchToRegister={handleSwitchToRegister} />
      </TabsContent>
      <TabsContent value="register">
        <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
      </TabsContent>
    </Tabs>
  );
}
