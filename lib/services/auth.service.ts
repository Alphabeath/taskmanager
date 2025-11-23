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
  (await cookies()).set("session", session.secret, {
    httpOnly: true,
    path: "/",
    secure: true
  });
  
  return { success: true };
};

export const logout = async () => {
  const { account } = await createSessionClient();
  await account.deleteSession("current");
  (await cookies()).delete("session");
  
  return { success: true };
};

export const getCurrentUser = async () => {
  try{
  const { account } = await createSessionClient();
  return await account.get();
  } catch {
    return null;
  }
};

export const getCurrentSession = async () => {
  try {
    const { account } = await createSessionClient();
    return await account.getSession("current");
  } catch {
    return null;
  }
};