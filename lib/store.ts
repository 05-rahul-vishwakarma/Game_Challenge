export type BetStatus = "open" | "accepted" | "resolved";

export type CoinSide = "heads" | "tails";

export interface Bet {
  _id: string;
  title: string;
  amount: number;
  status: BetStatus;
  creator: string;
  opponent?: string;
  winner?: string;
  createdAt: number;
  creatorChoice?: CoinSide;
  gamePlayed?: boolean;
}
