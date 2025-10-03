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

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Invalid data!" });
    }

    const user = await db.getUserByEmail(email);
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(password, salt);
      await db.saveUser(email, hashedPass);
      return res.status(201).json({ message: "User created!" });
    }

    return res.status(409).json({ message: "Email is already used!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error!" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Invalid credential!" });
    }

    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid credential!" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credential!" });
    }

    return res.status(200).json({
      message: "Login successful!",
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error!" });
  }
});

app.listen(PORT, () => {
  console.log(`Server runs on http://localhost:${PORT}`);
});
