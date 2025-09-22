"use client";

import { useEffect, useState } from "react";

import { usePathname, useRouter } from "next/navigation";

import {
  BarChart3,
  Clock,
  FileText,
  Folder,
  Home,
  Plus,
  Settings,
  Star,
  Trash2,
  Users,
} from "lucide-react";

import type { Creative } from "@/types/project";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

interface MenuItemType {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count: number | null;
  route: string;
  id: string;
}

interface Project {
  id: string;
  name: string;
  createdAt: string;
}

export function ExpandableSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [criativos, setCriativos] = useState<Creative[]>([]);
  const [isLoadingCreatives, setIsLoadingCreatives] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Load project and criativos data
    const currentProject = localStorage.getItem("currentProject");
    if (currentProject) {
      const projectData = JSON.parse(currentProject);
      setProject(projectData);
      loadCreatives(projectData.id);
    }
  }, []);

  const loadCreatives = async (projectId: string) => {
    setIsLoadingCreatives(true);
    try {
      const response = await fetch(`/api/creatives?projectId=${projectId}`);
      if (response.ok) {
        const creativesData = await response.json();
        setCriativos(creativesData);
      }
    } catch (error) {
      console.error("Error loading creatives:", error);
    } finally {
      setIsLoadingCreatives(false);
    }
  };

  const menuItems: MenuItemType[] = [
    {
      icon: Home,
      label: "Dashboard",
      count: null,
      route: "/dashboard",
      id: "dashboard",
    },
    {
      icon: FileText,
      label: "Criativos",
      count: criativos.length,
      route: "/dashboard",
      id: "criativos",
    },
    {
      icon: Star,
      label: "Favoritos",
      count: criativos.filter(c => c.status === "PUBLISHED").length,
      route: "/dashboard?filter=favoritos",
      id: "favoritos",
    },
    {
      icon: Clock,
      label: "Recentes",
      count: null,
      route: "/dashboard?filter=recentes",
      id: "recentes",
    },
  ];

  const secondaryItems: MenuItemType[] = [
    {
      icon: Folder,
      label: "Projetos",
      count: null,
      route: "/projetos",
      id: "projetos",
    },
    {
      icon: BarChart3,
      label: "Relatórios",
      count: null,
      route: "/relatorios",
      id: "relatorios",
    },
    {
      icon: Trash2,
      label: "Lixeira",
      count: criativos.filter(c => c.status === "DRAFT").length,
      route: "/dashboard?filter=rascunhos",
      id: "lixeira",
    },
  ];

  const handleMenuClick = (item: MenuItemType) => {
    if (item.id === "relatorios") {
      // Feature not implemented yet
      alert("Relatórios será implementado em breve!");
      return;
    }

    router.push(item.route);
  };

  const handleSettingsClick = () => {
    router.push("/onboarding");
  };

  const handleCreateVSL = () => {
    router.push("/criativos/vsl/create");
  };

  const isActiveRoute = (route: string) => {
    if (route === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(route);
  };

  return (
    <aside
      className="bg-sidebar border-sidebar-border fixed top-0 left-0 z-10 h-full border-r transition-all duration-300 ease-in-out"
      style={{ width: isExpanded ? "280px" : "64px" }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex h-full flex-col">
        {/* Logo/Brand */}
        <div className="border-sidebar-border border-b p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <span className="text-sm font-bold text-white">C</span>
            </div>
            {isExpanded && (
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">CopyFlow</span>
                {project && (
                  <span className="truncate text-xs text-gray-600">
                    {project.name}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-2">
          <div className="space-y-1">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = isActiveRoute(item.route);
              return (
                <Button
                  key={index}
                  variant="ghost"
                  onClick={() => handleMenuClick(item)}
                  className={`h-12 w-full justify-start gap-3 transition-colors ${
                    !isExpanded ? "px-2" : ""
                  } ${
                    isActive
                      ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <IconComponent className="size-5 flex-shrink-0" />
                  {isExpanded && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.count !== null && (
                        <Badge
                          variant={isActive ? "default" : "secondary"}
                          className="ml-auto text-xs"
                        >
                          {item.count}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              );
            })}
          </div>

          {isExpanded && <Separator className="my-4 bg-gray-200" />}

          {/* Quick Actions */}
          <div className="mb-4 space-y-1">
            <Button
              onClick={handleCreateVSL}
              className={`h-10 w-full justify-start gap-3 bg-blue-600 text-white hover:bg-blue-700 ${
                !isExpanded ? "px-2" : ""
              }`}
            >
              <Plus className="size-4 flex-shrink-0" />
              {isExpanded && (
                <span className="flex-1 text-left text-sm">Criar VSL</span>
              )}
            </Button>
          </div>

          {isExpanded && <Separator className="my-3 bg-gray-200" />}

          <div className="space-y-1">
            {secondaryItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = isActiveRoute(item.route);
              return (
                <Button
                  key={index}
                  variant="ghost"
                  onClick={() => handleMenuClick(item)}
                  className={`h-12 w-full justify-start gap-3 transition-colors ${
                    !isExpanded ? "px-2" : ""
                  } ${
                    isActive
                      ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <IconComponent className="size-5 flex-shrink-0" />
                  {isExpanded && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.count !== null && (
                        <Badge
                          variant={isActive ? "default" : "secondary"}
                          className="ml-auto text-xs"
                        >
                          {item.count}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              );
            })}
          </div>
        </nav>

        {/* Settings */}
        <div className="border-t border-gray-200 p-2">
          <Button
            variant="ghost"
            onClick={handleSettingsClick}
            className={`h-12 w-full justify-start gap-3 text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 ${
              !isExpanded ? "px-2" : ""
            }`}
          >
            <Settings className="size-5 flex-shrink-0" />
            {isExpanded && (
              <span className="flex-1 text-left">Configurações</span>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}
