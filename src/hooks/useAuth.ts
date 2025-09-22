import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is stored in localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const signup = async (email: string, password: string, name?: string) => {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Signup failed");
    }

    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("currentProject");
    setUser(null);
    router.push("/auth/login");
  };

  const requireAuth = () => {
    if (!user && !isLoading) {
      router.push("/auth/login");
      return false;
    }
    return true;
  };

  return {
    user,
    isLoading,
    login,
    signup,
    logout,
    requireAuth,
    isAuthenticated: !!user,
  };
}
