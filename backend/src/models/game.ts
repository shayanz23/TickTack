export class Game {
  private id: number;
  private winnerId: string;
  private typeId: number;
  private date: Date;
  private playerIds: string[];
  private boxPlayerIds: string[][];

  constructor(
    id: number,
    winnerId: string,
    typeId: number,
    date: Date,
    playerIds: string[],
    boxPlayerIds: string[][]
  ) {
    this.id = id;
    this.winnerId = winnerId;
    this.typeId = typeId;
    this.date = date;
    this.playerIds = playerIds;
    this.boxPlayerIds = boxPlayerIds;
  }
}
