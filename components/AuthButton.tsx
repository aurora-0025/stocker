"use client";

import { useAuth } from "@/context/authProvider";
import { Button } from "./ui/button";

export default function AuthButton() {
  const { user, login, logout } = useAuth();

  return (
    <div>
      {user ? (
        <Button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Logout
        </Button>
      ) : (
        <Button
          onClick={login}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Login
        </Button>
      )}
    </div>
  );
}
