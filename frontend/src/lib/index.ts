// place files you want to import through the `$lib` alias in this folder.
import backendRoutes from '$lib/shared/backendRoutes.json';
import { userId, email, username, xp, role } from "$lib/shared/stores/user"
let subscribedUserId: string | null;

// "variable" is the variable configured in the stores.ts
userId.subscribe((value) => (subscribedUserId = value));


export async function getUserInfo() {
    let jsonRes = null;
    const url = backendRoutes.users + `/${subscribedUserId}`;
    let response: Response;
    try {
        response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                Accept: 'application/json'
            }
        });
        jsonRes = await response.json();
        if (!response.ok) {
            userId.set(null);
            email.set(null)
            username.set(null)
            xp.set(null)
            role.set(null)
            throw new Error(jsonRes);
        } else {
            email.set(jsonRes.email)
            username.set(jsonRes.username)
            xp.set(jsonRes.xp)
            role.set(jsonRes.role)
        }
    } catch (error) {
        userId.set(null);
        email.set(null)
        username.set(null)
        xp.set(null)
        role.set(null)
    }
    return jsonRes;
}

export async function getUserGames() {
    let jsonRes = null;
    const url = backendRoutes.users + `/${subscribedUserId}/games`;
    let response: Response;
    try {
        response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                Accept: 'application/json'
            }
        });
        jsonRes = await response.json();
        if (!response.ok) {
            throw new Error(jsonRes);
        } else {

        }
    } catch (error) {
        userId.set(null);
        email.set(null)
        username.set(null)
        xp.set(null)
        role.set(null)
    }
    return jsonRes;
}

