"use server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { JwtSession } from "@/lib/types";

// verify if the user is authenticated and return the session data
export async function getUserAuth() {
  const token = (await cookies()).get("cubos-movies-session")!.value;
  if (!token) {
    return { error: "Token não disponível" };
  }
  const decoded = jwtDecode(token) as JwtSession;
  return decoded;
}
