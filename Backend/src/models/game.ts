class Game {
  id: number;
  winnerId: number;
  typeId: number;
  date: Date;
  playerIds: number[];
  boxIds: number[][];

  constructor(
    id: number,
    winnerId: number,
    typeId: number,
    date: Date,
    playerIds: number[],
    boxIds: number[][]
  ) {
    this.id = id;
    this.winnerId = winnerId;
    this.typeId = typeId;
    this.date = date;
    this.playerIds = playerIds;
    this.boxIds = boxIds;
  }
}
