export interface User {
  $id: string;
  name: string;
  email: string;
  emailVerification: boolean;
  $createdAt?: string;
  $updatedAt?: string;
}


export interface Session {
  $id: string;
  userID: string;
  provider: string;
  $createdAt?: string;
  $updatedAt?: string;
}