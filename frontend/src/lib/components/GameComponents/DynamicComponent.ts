import { BoxComponent, Component0, Component1, Component2, Component3 } from "./BoxComponents";
import { GameLogic } from "./GameLogic";

export const Components: any = {
    Component0,
    Component1,
    Component2,
    Component3
}

export class DynamicComponent {
    constructor(ComponentName: string, AreaXBegin: number, AreaYBegin: number, canvas: GameLogic, player: string) {
        if (Components[ComponentName] === undefined || Components[ComponentName] === null) {
            throw new Error(`Class type of \'${ComponentName}\' is not in the store`);
        }
        return new Components[ComponentName](AreaXBegin, AreaYBegin, canvas, player);
    }
}