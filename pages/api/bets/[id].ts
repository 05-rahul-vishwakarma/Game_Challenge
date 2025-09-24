import { NextApiRequest } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId, WithId } from "mongodb";
import { NextApiResponseServerIO } from "@/types/socket";
import { initSocketServer } from "@/lib/socket";
import { BetDocument } from "@/types/mongodb";
import { Bet } from "@/lib/store";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  initSocketServer(res);
  const { db } = await connectToDatabase();
  const collection = db.collection<BetDocument>("bets");

  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid bet ID" });
  }

  let objectId;
  try {
    objectId = new ObjectId(id);
  } catch (error) {
    return res.status(400).json({ message: "Invalid bet ID" });
  }

  if (req.method === "GET") {
    try {
      const betDoc = await collection.findOne({ _id: objectId });
      if (!betDoc) {
        return res.status(404).json({ message: "Bet not found" });
      }
      const { _id, ...rest } = betDoc;
      const bet: Bet = { _id: _id.toHexString(), ...rest };
      res.status(200).json(bet);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  } else if (req.method === "PUT") {
    try {
      const { status, opponent, winner, gamePlayed } = req.body;
      const update: any = {};

      if (status === "accepted") {
        if (!opponent) {
          return res.status(400).json({ message: "Invalid action" });
        }
        update.status = "accepted";
        update.opponent = opponent;
      } else if (status === "resolved") {
        if (!winner) {
          return res.status(400).json({ message: "Invalid action" });
        }
        update.status = "resolved";
        update.winner = winner;
      } else if (gamePlayed !== undefined) {
        update.gamePlayed = gamePlayed;
      } else {
        return res.status(400).json({ message: "Invalid update" });
      }

      const result: WithId<BetDocument> | null =
        await collection.findOneAndUpdate(
          { _id: objectId },
          { $set: update },
          { returnDocument: "after" }
        );

      if (!result) {
        return res.status(404).json({ message: "Bet not found" });
      }

      const { _id, ...rest } = result;
      const updatedBet: Bet = { _id: _id.toHexString(), ...rest };

      res.socket.server.io.emit("bet:updated", updatedBet);
      res.status(200).json(updatedBet);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  } else if (req.method === "DELETE") {
    try {
      const result = await collection.deleteOne({ _id: objectId });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Bet not found" });
      }
      res.socket.server.io.emit("bet:deleted", id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
