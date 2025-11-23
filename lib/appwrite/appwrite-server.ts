"use server";
import { Client, Account, Users, TablesDB } from 'node-appwrite';
import { cookies } from 'next/headers';

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "");

  const cookieStore = await cookies();
  const session = cookieStore.get('session');

  if (session) {
    client.setSession(session.value);
  }

  return {
    account: new Account(client),
    tablesDB: new TablesDB(client),
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")
    .setKey(process.env.NEXT_APPWRITE_API_KEY || "");

  return {
    account: new Account(client),
    users: new Users(client),
    tablesDB: new TablesDB(client),
  };
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.log(error)
    return null;
  }
}