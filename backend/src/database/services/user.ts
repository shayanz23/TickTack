import postgres, { Error } from "postgres";
import { compareSync } from "bcrypt-ts";

import sql from "../database.js";
import { Role } from "../../models/role.js";
import { User } from "../../models/user.js";
import { Game } from "../../models/game.js";
import NotFoundError from "../../models/errors/not-found-error.js";
import BadRequestError from "../../models/errors/bad-request-error.js";
import { UserPublic } from "../../models/user-public.js";


export async function getAllUsers() {
    const rows = (await sql`SELECT * FROM _user;`);
    const users: User[] = rows.map(row => new User(row.id, row.email, row.username, row.password, row.xp, row.xp_public, row.theme, row.role));
    return users;
}

export async function getAllUsersPublic() {
    const rows = (await sql`SELECT 
  id, 
  username, 
  CASE WHEN xp_public = TRUE THEN xp ELSE NULL END AS xp,
  xp_public
FROM _user;`);
    const users: UserPublic[] = rows.map(row => new UserPublic(row.id, row.username, row.xp !== undefined ? row.xp : 0, row.xp_public));
    return users;
}

export async function getUsernames(ids: number[]) {
    const rows = (await sql`SELECT username FROM _user WHERE id = ANY(${ids});`);
    const usernames = rows.map(row => row.username);
    return usernames;
}

export async function getUser(id: number): Promise<User> {
    const dbUsers = (await sql`SELECT * FROM _user WHERE id = ${id};`);
    if (dbUsers.length > 0) {
        const user: User = new User(dbUsers[0].id, dbUsers[0].email, dbUsers[0].username, dbUsers[0].password, dbUsers[0].xp, dbUsers[0].xp_public, dbUsers[0].theme, dbUsers[0].role);
        return user;
    } else {
        throw new NotFoundError({ message: "No user with this ID found.", logging: true });
    }
}

export async function getGamesByUserId(id: number): Promise<Game[]> {
    const dbArray: postgres.Row[] = await sql`select * from game where ${id}=ANY(player_ids);`
    let gameArray: Game[] = [];
    dbArray.forEach(row => {
        gameArray.push(new Game(row.id, row.winner_id, row.type_id, row.date, row.player_ids, row.box_player_ids));
    });

    return (gameArray);
}

export async function logIn(username: string, password: string): Promise<User> {
    const dbUsers = (await sql`SELECT * FROM _user WHERE (username = ${username} OR email = ${username});`);
    if (dbUsers.length > 0 && compareSync(password, dbUsers[0].password)) {
        const dbUser = dbUsers[0];
        const user: User = new User(dbUser.id, dbUser.email, dbUser.username, dbUser.password, dbUser.xp, dbUser.xp_public, dbUser.theme, dbUser.role);
        return user;
    } else {
        throw new BadRequestError({ message: "Wrong credentials.", logging: true });
    }
}


export async function checkIfUsernameIsAvailable(username: string): Promise<Boolean> {
    const dbUsers = (await sql`SELECT * FROM _user WHERE (username = ${username});`);
    if (dbUsers.length > 0) {
        return false;
    } else {
        return true;
    }
}

export async function checkIfEmailIsAvailable(email: string): Promise<Boolean> {
    const dbUsers = (await sql`SELECT * FROM _user WHERE (email = ${email});`);
    if (dbUsers.length > 0) {
        return false;
    } else {
        return true;
    }
}

export async function createUser(newUser: User): Promise<User> {
    console.log(`${newUser.role.toString()}`);
    const dbUser = (await sql`INSERT INTO _user (email, username, password, role) VALUES (${newUser.email}, ${newUser.username}, ${newUser.password}, ${Role[newUser.role]}) returning *;`)[0];
    const user: User = new User(dbUser.id, dbUser.email, dbUser.username, dbUser.password, dbUser.xp, dbUser.xp_public, dbUser.theme, dbUser.role);
    return user;
}

export async function deleteUser(id: number) {
    const dbUsers = (await sql` DELETE FROM _user WHERE id = ${id} returning *;`);
    if (dbUsers.length > 0) {
        const dbUser = dbUsers[0];
        const user: User = new User(dbUser.id, dbUser.email, dbUser.username, dbUser.password, dbUser.xp, dbUser.xp_public, dbUser.theme, dbUser.role);
        return user;
    } else {
        throw new NotFoundError({ message: "User not found.", logging: true });
    }
}

export async function updateUser(id: number, email: string, username: string, password: string, role: Role) {
    const dbUsers = (await sql` DELETE FROM _user WHERE id = ${id} returning *;`);
    if (dbUsers.length > 0) {
        const dbUser = dbUsers[0];
        const user: User = new User(dbUser.id, dbUser.email, dbUser.username, dbUser.password, dbUser.xp, dbUser.xp_public, dbUser.theme, dbUser.role);
        return user;
    } else {
        throw new NotFoundError({ message: "User not found.", logging: true });
    }
}