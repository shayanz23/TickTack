import type { Role } from "./role.js";
import { Theme } from "./theme.js";

export class UserPublic {
    private _id: number;
    private _username: string;
    private _xp: number;
    private _xpPublic: boolean = true;

    public get xpPublic(): boolean {
        return this._xpPublic;
    }
    public set xpPublic(value: boolean) {
        this._xpPublic = value;
    }

    public get id(): number {
        return this._id;
    }

    public get username(): string {
        return this._username;
    }
    public set username(value: string) {
        this._username = value;
    }

    public get xp(): number {
        return this._xp;
    }
    public set xp(value: number) {
        this._xp = value;
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
        username: string,
        xp: number,
        xpPublic: boolean,
    ) {
        this._id = id;
        this._username = username;
        this._xp = xp;
        this._xpPublic = xpPublic;
    }
}
