// src/app/(private)/layout.tsx
"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image"; // IMPORTADO
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Home,
  Trophy,
  PersonStanding,
  Shield,
  Loader2,
  Settings,
  LoaderPinwheel,
  Text,
  MessageSquare,
  MessageSquareMore,
} from "lucide-react";
import Link from "next/link";
import { ModalSelecionarTime } from "./_components/modal-selecionar-time";
import { fetchTeams } from "@/services/times/timesService";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Times",
    url: "/times",
    icon: Shield,
  },
  {
    title: "Jogadores",
    url: "/jogadores",
    icon: PersonStanding,
  },
  {
    title: "Ligas",
    url: "/ligas",
    icon: Trophy,
  },
  {
    title: "Jogos",
    url: "/",
    icon: LoaderPinwheel,
  },
  {
    title: "Tabela",
    url: "/",
    icon: Text,
  },
  {
    title: "Chat Geral",
    url: "/chatGeral",
    icon: MessageSquareMore,
  },
  {
    title: "Chat",
    url: "/chat",
    icon: MessageSquare,
  },
];

interface Team {
  id: string;
  name: string;
  image: string;
}

interface CustomSessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  teamId?: string | null;
}

interface CustomSession {
  user?: CustomSessionUser | null;
  expires: string;
  accessToken: string;
}

function AppSidebar() {
  const {
    data: session,
    status,
    update,
  } = useSession() as {
    data: CustomSession | null;
    status: "loading" | "authenticated" | "unauthenticated";
    update: any;
  };
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDark =
      savedTheme === "dark" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);

    const loadTeams = async () => {
      try {
        const allTeams = await fetchTeams();
        setTeams(allTeams);
      } catch (error) {
        console.error("Erro ao carregar times:", error);
      }
    };
    loadTeams();
  }, []);

  useEffect(() => {
    if (status === "authenticated" && session?.user && !session.user.teamId) {
      setIsTeamModalOpen(true);
    }
  }, [session, status]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ redirect: false });
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleThemeChange = (checked: boolean) => {
    setIsDarkMode(checked);
    document.documentElement.classList.toggle("dark", checked);
    localStorage.setItem("theme", checked ? "dark" : "light");
  };

  const handleTeamSelected = async (newTeamId: string) => {
    await update({ teamId: newTeamId });
    setIsTeamModalOpen(false);
  };

  // Encontra o time do usuário para pegar a imagem do escudo
  const userTeam = teams.find((team) => team.id === session?.user?.teamId);

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading" || !session) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <h2 className="text-lg font-semibold">Goal Wise</h2>
          <img src="/soccer2.png" alt="Image" className="size-12" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start space-x-2">
              <Settings className="h-4 w-4" />
              <span>Configurações</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Aparência</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center justify-between">
              <span>Modo Escuro</span>
              <Switch
                checked={isDarkMode}
                onCheckedChange={handleThemeChange}
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="w-full justify-start space-x-0">
              {userTeam && (
                <Image
                  src={userTeam.image || "/nao-ha-fotos.png"}
                  width={16}
                  height={16}
                  alt={userTeam.name}
                  className="object-contain rounded-md"
                />
              )}
              <span>
                {session.user?.name || session.user?.email || "Usuário"}
              </span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmação de Logout</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja sair do sistema?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saindo...
                  </>
                ) : (
                  "Sair"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarFooter>
      {session.user && (
        <ModalSelecionarTime
          isOpen={isTeamModalOpen}
          onCloseAction={() => setIsTeamModalOpen(false)}
          userId={session.user.id}
          onTeamSelectedAction={handleTeamSelected}
        />
      )}
    </Sidebar>
  );
}

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="border-b p-4">
            <SidebarTrigger />
          </div>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
