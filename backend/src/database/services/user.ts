import postgres, { Error } from "postgres";
import { compareSync } from "bcrypt-ts";

import sql from "../database.js";
import { Role } from "../../models/role.js";
import { User } from "../../models/user.js";
import { Game } from "../../models/game.js";
import NotFoundError from "../../models/errors/not-found-error.js";


export async function getAllUsers() {
  return (await sql`SELECT * FROM _user;`) as User[];
}

export async function getUser(id: number): Promise<User> {
  const dbUsers = (await sql`SELECT * FROM _user WHERE id = ${id};`);
  if (dbUsers.length > 0) {
    const user: User = dbUsers[0] as User;
    return user;
  } else {
    throw new NotFoundError({ message: "No user with this ID found.", logging: true });
  }
}

export async function getGamesByUserId(id: number) {
	const dbArray: postgres.Row[] = await sql`select * from game where ${id}=ANY(player_ids);`
	let gameArray: Game[] = [];
	dbArray.forEach(row => {
		gameArray.push(new Game(row.id, row.winner_id, row.type_id, row.date, row.player_ids, row.box_player_ids));
	});

	return (gameArray);
}

export async function logIn(username: string, password: string): Promise<User> {
  const dbUsers = (await sql`SELECT * FROM _user WHERE (username = ${username} OR email = ${username});`);
  console.log(`${password}, ${dbUsers[0].password}`);
  if (dbUsers.length > 0 && compareSync(password, dbUsers[0].password)) {
    const dbUser = dbUsers[0];
    const user: User = new User(dbUser.id, dbUser.email, dbUser.username, dbUser.password, dbUser.xp, dbUser.role);
    return user;
  } else {
    throw new NotFoundError({ message: "Wrong credentials.", logging: true });
  }
}

export async function createUser(email: string, username: string, password: string, role: Role): Promise<User> {
  console.log(`${role.toString()}`);
  const dbUser = (await sql`INSERT INTO _user (email, username, password, role) VALUES (${email}, ${username}, ${password}, ${role.toString()}) returning *;`)[0];
  const user: User = dbUser as User;
  return user;
}

export async function deleteUser(id: number) {
  const dbUsers = (await sql` DELETE FROM _user WHERE id = ${id} returning *;`);
  if (dbUsers.length > 0) {
    const dbUser = dbUsers[0];
    const user: User = new User(dbUser.id, dbUser.email, dbUser.username, dbUser.password, dbUser.xp, dbUser.role);
    return user;
  } else {
    throw new NotFoundError({ message: "User not found.", logging: true });
  }
}

export async function updateUser(id: number, email: string, username: string, password: string, role: Role) {
  const dbUsers = (await sql` DELETE FROM _user WHERE id = ${id} returning *;`);
  if (dbUsers.length > 0) {
    const dbUser = dbUsers[0];
    const user: User = new User(dbUser.id, dbUser.email, dbUser.username, dbUser.password, dbUser.xp, dbUser.role);
    return user;
  } else {
    throw new NotFoundError({ message: "User not found.", logging: true });
  }
}