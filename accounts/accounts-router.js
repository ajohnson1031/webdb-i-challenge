const express = require("express");

const db = require("../data/dbConfig.js");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const accounts = await db("accounts");
    accounts
      ? res.status(200).json(accounts)
      : res.status(404).json({ message: "Error retrieving database records." });
  } catch (error) {
    res.status(500).json({ message: "db error: ", error });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const account = await db("accounts").where({ id });
    account
      ? res.status(200).json(account)
      : res.status(404).json({
          message: "No account exists in association with the supplied ID."
        });
  } catch (error) {
    res.status(500).json({ message: "db error: ", error });
  }
});

router.post("/", async (req, res) => {
  const body = req.body;
  if (!body.name || !body.budget)
    res
      .send(400)
      .json({ message: "New accounts require both a name and a budget." });
  else {
    try {
      const account = await db.insert(body).into("accounts");
      account
        ? res.status(201).json(account)
        : res.status(400).json({ message: "Invalid account entry." });
    } catch (error) {
      res.status(500).json({ message: "db error: ", error });
    }
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  try {
    const account = await db("accounts")
      .where({ id })
      .update(changes);
    account
      ? res.status(200).json(account)
      : res.status(400).json({
          message: "No account exists in association with the supplied ID."
        });
  } catch (error) {
    res.status(500).json({ message: "db error: ", error });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!id)
    res.status(400).json({ message: "No ID supplied for this request." });
  else {
    try {
      const account = await db("accounts")
        .where({ id })
        .del();

      account
        ? res.status(200).json({ message: "Record has been deleted." })
        : res.status(404).json({
            message: "No account exists in association with the supplied ID."
          });
    } catch (error) {
      res.status(500).json({ message: "db error: ", error });
    }
  }
});

module.exports = router;
