export type User = {
  name: string;
  email: string;
  dob?: string;
  active: boolean;
  lastUpdatedAt: number;
  createdAt: number;
};

export type UserWithId = { userId: string } & User;

export type CreateUserInput = Omit<User, "lastUpdatedAt" | "createdAt">;

export type UpdateUserInput = Partial<CreateUserInput>;
