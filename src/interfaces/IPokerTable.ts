export interface IPokerTable {
  id: string;
  name: string;
  bigBlind: number;
  minBuyin: number;
  maxBuyin: number;
  minPlayers: number;
  maxPlayers: number;
}