import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";

export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
}

export const logout = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    throw error;
  }
}