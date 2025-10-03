import express from "express";
import cors from "cors";
import * as db from "./data/db.js";
import bcrypt from "bcrypt";

const PORT = 3000;

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.get("/users", (req, res) => {
  const users = db.getUsers();

  res.status(200).json(users);
});

app.get("/users/:id", (req, res) => {
  const user = db.getUserById(+req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }

  res.status(200).json(user);
});

app.post("/users", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Invalid data!" });
  }

  const salt = await bcrypt.genSalt();
  const hashedPass = await bcrypt.hash(password, salt);
  const saved = db.saveUser(email, hashedPass);
  const user = db.getUserById(saved.lastInsertRowid);

  res.status(200).json(user);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Invalid credential!" });
  }

  const user = db.getUserByEmail(email);
  if (!user) {
    return res.status(400).json({ message: "Invalid credential!" });
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({ message: "Invalid credential!" });
  }

  res.status(200).json(user);
});

app.listen(PORT, () => {
  console.log(`Server runs on http://localhost:${PORT}`);
});
