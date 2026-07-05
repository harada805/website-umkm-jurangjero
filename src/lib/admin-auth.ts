import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getSecondaryAuth, hasFirebaseConfig } from "./firebase";

export async function createAdminLoginAccount(email: string, password: string) {
  if (!hasFirebaseConfig) {
    throw new Error("Database belum tersambung. Akun login hanya dibuat lokal.");
  }

  const secondaryAuth = getSecondaryAuth();
  const credential = await createUserWithEmailAndPassword(
    secondaryAuth,
    email,
    password
  );

  await signOut(secondaryAuth).catch(() => undefined);

  return {
    uid: credential.user.uid,
    email: credential.user.email ?? email
  };
}
