import { ObjectId } from "mongodb";

export type BetStatus = "open" | "accepted" | "resolved";

import { CoinSide } from "@/lib/store";

export interface BetDocument {
  _id: ObjectId;
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
