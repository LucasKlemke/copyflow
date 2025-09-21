import { ChevronDown, Menu, MoreVertical, Search } from "lucide-react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white px-6 py-3">
      <div className="flex items-center gap-4">
        {/* Menu and Logo */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="p-2">
            <Menu className="size-5 text-gray-600" />
          </Button>
          <div className="flex items-center gap-2">
            <Select defaultValue="projeto1">
              <SelectTrigger className="w-48 border-0 bg-transparent transition-colors hover:bg-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="projeto1">Projeto Principal</SelectItem>
                <SelectItem value="projeto2">Design System</SelectItem>
                <SelectItem value="projeto3">Mobile App</SelectItem>
                <SelectItem value="projeto4">Website</SelectItem>
                <SelectItem value="projeto5">Marketing</SelectItem>
              </SelectContent>
            </Select>
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
          <Button variant="ghost" size="sm" className="p-2">
            <MoreVertical className="size-5 text-gray-600" />
          </Button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
            <span className="text-sm text-white">U</span>
          </div>
        </div>
      </div>
    </header>
  );
}
