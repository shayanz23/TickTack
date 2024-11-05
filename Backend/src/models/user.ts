import type { Role } from "./role.js";

class User {
  id: number;
  email: string;
  username: string;
  password: string;
  xp: number;
  role: Role;

  constructor(
    id: number,
    email: string,
    username: string,
    password: string,
    xp: number,
    role: Role
  ) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.password = password;
    this.xp = xp;
    this.role = role;
  }
}
