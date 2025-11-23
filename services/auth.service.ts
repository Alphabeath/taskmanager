"use server"
import { createAdminClient, createSessionClient } from "@/lib/appwrite/appwrite-server";
import { ID } from "node-appwrite";
import { cookies } from "next/headers";


export const register = async (
  email: string,
  password: string,
  name: string
) => {

  const { account } = await createAdminClient();
  await account.create({
    userId: ID.unique(),
    email,
    password,
    name,
  });

  const session = await account.createEmailPasswordSession(email, password);
  (await cookies()).set("session", session.secret, {
    httpOnly: true,
    path: "/",
  });
  
  return { success: true };
};

export const login = async (email: string, password: string) => {
  const { account } = await createAdminClient();
  const session = await account.createEmailPasswordSession(email, password);
  
  // USAR LA MISMA LÓGICA DE SEGURIDAD QUE EN LOGOUT
  const isProduction = process.env.NODE_ENV === "production";

  (await cookies()).set("session", session.secret, {
    httpOnly: true,
    path: "/",
    secure: isProduction, // Dinámico, igual que el logout
    sameSite: "lax",      // Recomendado añadir esto
  });
  
  return { success: true };
};

export const logout = async () => {
  // 1. Borrar sesión en Appwrite
  const { account } = await createSessionClient();
  try {
    await account.deleteSession("current");
  } catch (error) {
    // Ignoramos si ya no existe sesión en Appwrite para permitir limpiar la cookie
    console.error("Error deleting session:", error); 
  }

  // 2. Borrar cookie usando el método nativo .delete()
  // Esto limpia correctamente los atributos
  (await cookies()).delete("session");
};

export const getCurrentUser = async () => {
  try{
    const { account } = await createSessionClient();
    const user = await account.get();
    
    // Serializa el usuario a un objeto plano
    return JSON.parse(JSON.stringify(user));
  } catch {
    return null;
  }
};

export const getCurrentSession = async () => {
  try {
    const { account } = await createSessionClient();
    const session = await account.getSession("current");
    
    // Serializa la sesión a un objeto plano
    return JSON.parse(JSON.stringify(session));
  } catch {
    return null;
  }
};