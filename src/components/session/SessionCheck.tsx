"use server";
// import { validateSession } from "@/lib/auth/validateSession";
import { openSessionToken } from "@/lib/auth/jwt";
import { cookies } from "next/headers";
import LogoutButton from "./LogoutButton";

export default async function SessionCheckComponent() {
  const session = await openSessionToken(
    (await cookies()).get("cubos-movies-session")?.value || ""
  );
  return <div>{session && <LogoutButton />}</div>;
}
