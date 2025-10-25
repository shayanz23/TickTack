import type { Role } from "./role.js";
import { Theme } from "./theme.js";

export class User {
    private _id: number;
    private _email: string;
    private _username: string;
    private _password: string;
    private _xp: number;
    private _xpPublic: boolean = true;
    private _theme: Theme;
    private _role: Role;

    public get xpPublic(): boolean {
        return this._xpPublic;
    }
    public set xpPublic(value: boolean) {
        this._xpPublic = value;
    }

    public get theme(): Theme {
        return this._theme;
    }
    public set theme(value: Theme) {
        this._theme = value;
    }

    public get id(): number {
        return this._id;
    }

    public get email(): string {
        return this._email;
    }
    public set email(value: string) {
        this._email = value;
    }

    public get username(): string {
        return this._username;
    }
    public set username(value: string) {
        this._username = value;
    }

    public get password(): string {
        return this._password;
    }
    public set password(value: string) {
        this._password = value;
    }

    public get xp(): number {
        return this._xp;
    }
    public set xp(value: number) {
        this._xp = value;
    }

    public get role(): Role {
        return this._role;
    }
    public set role(value: Role) {
        this._role = value;
    }

    toJSON() {
        const proto = Object.getPrototypeOf(this);
        const jsonObj: any = {};
        Object.entries(this).forEach(([key, value]) => {
            if (key[0] !== '_') {
                jsonObj[key] = value;
            }
        });
        Object.entries(Object.getOwnPropertyDescriptors(proto))
            .filter(([key, descriptor]) => typeof descriptor.get === 'function' && key[0] !== '_')
            .forEach(([key, descriptor]) => {
                try {
                    const val = (this as any)[key];
                    jsonObj[key] = val;
                } catch (error) {
                    console.error(`Error calling getter ${key}`, error);
                }
            });

        return jsonObj;
    }

    constructor(
        id: number,
        email: string,
        username: string,
        password: string,
        xp: number,
        xpPublic: boolean,
        theme: Theme,
        role: Role
    ) {
        this._id = id;
        this._email = email;
        this._username = username;
        this._password = password;
        this._xp = xp;
        this._xpPublic = xpPublic;
        this._theme = theme;
        this._role = role;
    }
}
