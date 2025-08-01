// src/app/page.tsx OU src/app/(public)/page.tsx

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Importe os componentes Tabs
import Login from "../_components/login"; // Importe seu componente Login
import Register from "../_components/register"; // Importe seu componente Register

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <Tabs defaultValue="login" className="w-[400px]">
        {" "}
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Login />
        </TabsContent>
        <TabsContent value="register">
          <Register />{" "}
        </TabsContent>
      </Tabs>
    </div>
  );
}
