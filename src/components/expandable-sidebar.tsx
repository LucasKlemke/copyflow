"use client";

import { useState } from "react";

import {
  BarChart3,
  Clock,
  FileText,
  Folder,
  Home,
  Settings,
  Star,
  Trash2,
  Users,
} from "lucide-react";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

const menuItems = [
  { icon: Home, label: "Início", count: null },
  { icon: FileText, label: "Documentos", count: 12 },
  { icon: Folder, label: "Projetos", count: 8 },
  { icon: Star, label: "Favoritos", count: 5 },
  { icon: Clock, label: "Recentes", count: null },
];

const secondaryItems = [
  { icon: Users, label: "Compartilhados", count: 3 },
  { icon: BarChart3, label: "Relatórios", count: null },
  { icon: Trash2, label: "Lixeira", count: 7 },
];

export function ExpandableSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

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
            <div className="bg-sidebar-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <div className="bg-sidebar-primary-foreground h-4 w-4 rounded-sm" />
            </div>
            {isExpanded && (
              <span className="text-sidebar-foreground font-medium">
                Dashboard
              </span>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-2">
          <div className="space-y-1">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Button
                  key={index}
                  variant="ghost"
                  className={`text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-12 w-full justify-start gap-3 ${
                    !isExpanded ? "px-2" : ""
                  }`}
                >
                  <IconComponent className="size-5 flex-shrink-0" />
                  {isExpanded && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.count && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {item.count}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              );
            })}
          </div>

          {isExpanded && <Separator className="bg-sidebar-border my-4" />}

          <div className="space-y-1">
            {secondaryItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Button
                  key={index}
                  variant="ghost"
                  className={`text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-12 w-full justify-start gap-3 ${
                    !isExpanded ? "px-2" : ""
                  }`}
                >
                  <IconComponent className="size-5 flex-shrink-0" />
                  {isExpanded && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.count && (
                        <Badge variant="secondary" className="ml-auto text-xs">
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
        <div className="border-sidebar-border border-t p-2">
          <Button
            variant="ghost"
            className={`text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-12 w-full justify-start gap-3 ${
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
