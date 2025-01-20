import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { prisma } from "./db/db.mjs";
import path from "path";
dotenv.config();

const __dirname = path.resolve();
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.post("/create", async (req, res) => {
  const newChat = await prisma.chat.create({
    data: {
      text: req.body.message,
      role: req.body.role,
    },
  });
  if (!newChat) {
    res.status(400).json({ message: "Something went wrong" });
  }
  res.status(200).json({ message: "Message saved successfully" });
});

app.get("/getChats", async (req, res) => {
  const chats = await prisma.chat.findMany();
  if (chats.length === 0) {
    res.status(400).json({ message: "No chats found", data: [] });
  }
  res.status(200).json({ message: "Chats fetched successfully", data: chats });
});

// Deployment
app.use(express.static(path.join(__dirname, ".././frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, ".././frontend", "dist", "index.html"));
});

// Deployment ends

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running at port ${process.env.PORT}`)
);
