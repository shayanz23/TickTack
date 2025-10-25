import postgres, { PostgresType } from "postgres";

import { Game } from "../../models/game.js";
import { User } from "../../models/user.js";
import sql from "../database.js";
import * as converters from "../../services/converters.js";
import NotFoundError from "../../models/errors/not-found-error.js";
import { Role } from "../../models/role.js";

export async function getPlayers(id: number) {
    const dbGames: postgres.Row[] = await sql`select * from game WHERE id = ${id};`;
    if (dbGames.length > 0) {
        let players: User[] = [];
        const dbGame = dbGames[0];
        const game = new Game(dbGame.id, dbGame.winner_id, dbGame.type_id, dbGame.date, dbGame.player_ids, dbGame.box_player_ids);
        game.playerIds.forEach(async id => {
            const dbUsers = await sql`SELECT * FROM _user WHERE id = ${id};`;
            if (dbUsers.length > 0) {
                const dbUser = dbUsers[0];
                const user: User = new User(dbUser.id, dbUser.email, dbUser.username, dbUser.password, dbUser.xp, dbUser.xp_public, dbUser.theme, dbUser.role);
                players.push(user);
            }
        });
        return players;
    } else {
        throw new NotFoundError({ message: "No game with this ID found.", logging: true });
    }
}

export async function getGames() {
    const dbArray: postgres.Row[] = await sql`select * from game;`
    let gameArray: Game[] = [];
    dbArray.forEach(row => {
        gameArray.push(new Game(row.id, row.winner_id, row.type_id, row.date, row.player_ids, row.box_player_ids));
    });

    return (gameArray);
}

export async function getGame(id: number) {
    const dbGames: postgres.Row[] = await sql`select * from game WHERE id = ${id};`;
    if (dbGames.length > 0) {
        const dbGame = dbGames[0];
        return new Game(dbGame.id, dbGame.winner_id, dbGame.type_id, dbGame.date, dbGame.player_ids, dbGame.box_player_ids);
    } else {
        throw new NotFoundError({ message: "No game with this ID found.", logging: true });
    }
}

export async function getWinner(id: number) {
    const dbGames: postgres.Row[] = await sql`select * from game WHERE id = ${id};`;
    if (dbGames.length > 0) {
        const dbGame = dbGames[0];
        const winnerIdInt = converters.stringToInteger(new String(dbGame.winner_id));
        const dbUsers = await sql`SELECT * FROM _user WHERE id = ${winnerIdInt};`;
        if (dbUsers.length > 0) {
            const dbUser = dbUsers[0];
            return new User(dbUser.id, dbUser.email, dbUser.username, dbUser.password, dbUser.xp, dbUser.xp_public, dbUser.theme, dbUser.role);
        } else {
            throw new NotFoundError({ message: "Winner not found.", logging: true });
        }
    } else {
        throw new NotFoundError({ message: "No game with this ID found.", logging: true });
    }
}


export async function createGame(winnerId: string, typeId: number, playerIds: string[], boxPlayerIds: string[][]) {
    const dbUser = (await sql`INSERT INTO game (winner_id, type_id, player_ids, box_player_ids) VALUES (${winnerId}, ${typeId}, ${playerIds}, ${boxPlayerIds}) returning *;`)[0];
    const user: User = dbUser as User;
    return user;
}

