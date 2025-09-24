import { NextApiRequest } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import { Bet } from "@/lib/store";
import { NextApiResponseServerIO } from "@/types/socket";
import { initSocketServer } from "@/lib/socket";
import { BetDocument } from "@/types/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  initSocketServer(res);
  const { db } = await connectToDatabase();
  const collection = db.collection<BetDocument>("bets");

  if (req.method === "GET") {
    try {
      const betsDocuments = await collection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      const bets: Bet[] = betsDocuments.map((doc) => {
        const { _id, ...rest } = doc;
        return { _id: _id.toHexString(), ...rest };
      });
      res.status(200).json(bets);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  } else if (req.method === "POST") {
    try {
      const { title, amount, creator, creatorChoice } = req.body;

      if (!title || !amount || !creator || !creatorChoice) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const newBet: Omit<BetDocument, "_id"> = {
        title,
        amount: parseFloat(amount),
        creator,
        creatorChoice,
        status: "open",
        createdAt: Date.now(),
        gamePlayed: false,
      };

      const result = await collection.insertOne(newBet as any);

      const insertedBet: Bet = {
        ...(newBet as any),
        _id: result.insertedId.toHexString(),
      };

      res.socket.server.io.emit("bet:created", insertedBet);
      res.status(201).json(insertedBet);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
