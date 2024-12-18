"use client";

import { useAuth } from "@/context/authProvider";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function AuthButton() {
  const { user, login, logout } = useAuth();

  return (
    <div>
      {user ? (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={user.photoURL ?? undefined} alt={user.email ?? undefined} />
            <AvatarFallback>{user.displayName?.split(" ")[0]?.at(0)}{user.displayName?.split(" ")[1]?.at(0)}</AvatarFallback>
          </Avatar>
          <Button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Logout
          </Button>
        </div>
      ) : (
        <Button
          onClick={login}
          className="px-4 py-2"
        >
          SignIn with <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Google</title><path className="dark:fill-black fill-white" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
        </Button>
      )}
    </div>
  );
}
