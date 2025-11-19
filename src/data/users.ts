import type { User } from "../types";
import { offices } from "./offices";

// Generate user accounts from offices
export const officeUsers: User[] = offices.map((office) => ({
  id: `user-${office.id}`,
  email: office.loginEmail,
  password: office.loginPassword,
  role: "office" as const,
  officeId: office.id,
}));

// Customer accounts
export const customerUsers: User[] = [
  {
    id: "customer-1",
    email: "customer1@example.com",
    password: "customer123",
    role: "customer",
  },
  {
    id: "customer-2",
    email: "customer2@example.com",
    password: "customer123",
    role: "customer",
  },
];

// All users combined
export const allUsers: User[] = [...officeUsers, ...customerUsers];

