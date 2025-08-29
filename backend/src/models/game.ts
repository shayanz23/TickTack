export class Game {
    private _id: number;
    private _winnerId: string;
    private _typeId: number;
    private _date: Date;
    private _playerIds: number[];
    private _boxPlayerIds: number[][];

    public get id(): number {
        return this._id;
    }

    public get winnerId(): string {
        return this._winnerId;
    }
    public set winnerId(value: string) {
        this._winnerId = value;
    }

    public get typeId(): number {
        return this._typeId;
    }
    public set typeId(value: number) {
        this._typeId = value;
    }

    public get date(): Date {
        return this._date;
    }
    public set date(value: Date) {
        this._date = value;
    }

    public get playerIds(): number[] {
        return this._playerIds;
    }
    public set playerIds(value: number[]) {
        this._playerIds = value;
    }

    public get boxPlayerIds(): number[][] {
        return this._boxPlayerIds;
    }
    public set boxPlayerIds(value: number[][]) {
        this._boxPlayerIds = value;
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
        winnerId: string,
        typeId: number,
        date: Date,
        playerIds: number[],
        boxPlayerIds: number[][]
    ) {
        this._id = id;
        this._winnerId = winnerId;
        this._typeId = typeId;
        this._date = date;
        this._playerIds = playerIds;
        this._boxPlayerIds = boxPlayerIds;
    }
}
