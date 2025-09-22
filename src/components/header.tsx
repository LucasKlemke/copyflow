"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  ChevronDown,
  LogOut,
  Menu,
  MoreVertical,
  Plus,
  Search,
  User,
} from "lucide-react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface UserData {
  email: string;
  name: string;
}

interface ProjectData {
  id: string;
  name: string;
  createdAt: string;
  status?: string;
  modeloNegocio?: string;
}

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [project, setProject] = useState<ProjectData | null>(null);
  const [availableProjects, setAvailableProjects] = useState<ProjectData[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const projectData = localStorage.getItem("currentProject");

    if (userData) {
      const user = JSON.parse(userData);
      setUser(user);
      // Load available projects from API
      loadProjects(user.id);
    }

    if (projectData) {
      setProject(JSON.parse(projectData));
    }
  }, []);

  const loadProjects = async (userId: string) => {
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const projects = await response.json();
        // Map to header format
        const mappedProjects = projects.map((p: any) => ({
          id: p.id,
          name: p.name,
          createdAt: p.createdAt,
          status: p.status === "ATIVO" ? "ativo" : "pausado",
          modeloNegocio: p.modeloNegocio,
        }));
        setAvailableProjects(mappedProjects);
      }
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  };

  const handleProjectChange = async (projectId: string) => {
    if (projectId === "manage") {
      router.push("/projetos");
      return;
    }

    if (projectId === "create") {
      router.push("/projetos/create");
      return;
    }

    // Load complete project data from API
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (response.ok) {
        const fullProjectData = await response.json();

        // Store complete project data
        localStorage.setItem("currentProject", JSON.stringify(fullProjectData));

        // Update header state with mapped data
        const headerProject = {
          id: fullProjectData.id,
          name: fullProjectData.name,
          createdAt: fullProjectData.createdAt,
          status: fullProjectData.status === "ATIVO" ? "ativo" : "pausado",
          modeloNegocio: fullProjectData.modeloNegocio,
        };
        setProject(headerProject);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error loading project:", error);
      // Fallback to basic project data
      const selectedProject = availableProjects.find(p => p.id === projectId);
      if (selectedProject) {
        localStorage.setItem("currentProject", JSON.stringify(selectedProject));
        setProject(selectedProject);
        router.push("/dashboard");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("currentProject");
    router.push("/auth/login");
  };

  if (!user) {
    return null; // Don't show header if user is not logged in
  }
  return (
    <header className="border-b border-gray-200 bg-white px-6 py-3">
      <div className="flex items-center gap-4">
        {/* Menu and Logo */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="p-2">
            <Menu className="size-5 text-gray-600" />
          </Button>
          <div className="flex items-center gap-2">
            {project ? (
              <Select value={project.id} onValueChange={handleProjectChange}>
                <SelectTrigger className="w-64 border-0 bg-gray-100 transition-colors hover:bg-gray-200">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-xs font-bold text-white">
                        {project.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate font-medium text-gray-900">
                        {project.name}
                      </span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableProjects.map(proj => (
                    <SelectItem key={proj.id} value={proj.id}>
                      <div className="flex items-center gap-3 py-1">
                        <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-xs font-bold text-white">
                          {proj.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {proj.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {proj.status === "ativo"
                              ? "🟢 Ativo"
                              : "🟡 Pausado"}
                          </div>
                        </div>
                        {proj.id === project.id && (
                          <div className="text-blue-600">✓</div>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                  <div className="border-t">
                    <SelectItem value="create" className="text-green-600">
                      <div className="flex items-center gap-2 py-1">
                        <Plus className="h-4 w-4" />
                        <span>Criar Novo Projeto</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="manage" className="text-blue-600">
                      <div className="flex items-center gap-2 py-1">
                        <User className="h-4 w-4" />
                        <span>Gerenciar Projetos</span>
                      </div>
                    </SelectItem>
                  </div>
                </SelectContent>
              </Select>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-gray-600">CopyFlow</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/projetos")}
                  className="ml-2"
                >
                  Selecionar Projeto
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar - Center */}
        <div className="mx-auto max-w-2xl flex-1">
          <div className="relative">
            <Search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 transform text-gray-500" />
            <Input
              placeholder="Pesquisar"
              className="rounded-lg border-0 bg-gray-100 py-3 pr-4 pl-12 transition-all focus:bg-white focus:shadow-md"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 px-3"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                <span className="text-sm text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {user.name}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </Button>

            {showUserMenu && (
              <div className="absolute top-full right-0 z-50 mt-2 w-48 rounded-md border bg-white shadow-lg">
                <div className="py-1">
                  <div className="border-b px-4 py-2">
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-600">{user.email}</p>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-4 py-2 text-sm"
                    onClick={() => {
                      setShowUserMenu(false);
                      router.push("/projetos");
                    }}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Gerenciar Projetos
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
