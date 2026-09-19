import { Router } from "express";
import pool from "../db.js";

const router = Router();

// Create a new todo
router.post("/", async (req, res) => {
    try {
        const { description, completed } = req.body;

        if (!description || description.trim() === "") {
            return res.status(400).json({ error: "Description is required" });
        }

        const newTodo = await pool.query(
            "INSERT INTO todo (description, completed) VALUES($1, $2) RETURNING *",
            [description.trim(), completed || false]
        );

        res.json(newTodo.rows[0]);
    } catch (err) {
        console.error("POST ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// Get all todos
router.get("/", async (req, res) => {
    try {
        const allTodo = await pool.query("SELECT * FROM todo");
        res.json(allTodo.rows);
    } catch (err) {
        console.error("GET ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// Update todo
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { description, completed } = req.body;

    try {
        const updateTodo = await pool.query(
            "UPDATE todo SET description = COALESCE($1, description), completed = COALESCE($2, completed) WHERE id = $3 OR todo_id = $3 RETURNING *",
            [description || null, completed ?? null, id]
        );

        if (updateTodo.rows.length === 0) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.json(updateTodo.rows[0]);
    } catch (err) {
        console.error("PUT ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// Delete a todo
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const deleteTodo = await pool.query(
            "DELETE FROM todo WHERE id = $1 OR todo_id = $1 RETURNING *", 
            [id]
        );

        if (deleteTodo.rows.length === 0) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.json({ message: "Todo was deleted" });
    } catch (err) {
        console.error("DELETE ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});

export default router;