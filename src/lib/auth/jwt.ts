import * as jose from "jose";

export async function openSessionToken(token: string) {
  if (!token || token.length === 0) {
    return false;
  }

  try {
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);

    if (payload) {
      return payload;
    }

    return false;
  } catch (error) {
    console.log("Invalid JWT token:", error);
    return false;
  }
}

export async function createSessionToken(
  payload: Record<string, unknown>,
  userId: string
) {
  const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
  const session = await new jose.SignJWT({ payload, sub: userId })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setExpirationTime("7d")
    .sign(secret);

  return session;
}
