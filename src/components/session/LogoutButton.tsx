"use client";

import { destroySession } from "@/lib/auth/destroySession";
import { Button } from "../ui/button";

export default function LogoutButton() {
  const handleLogout = async () => {
    await destroySession();
    window.location.href = "/";
  };

  return (
    <div className="flex items-center gap-2">
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}
