import { Router } from "express";
import pool from "../db.js";
 
const router = Router();

//Create a new todo(data)
router.post("/", async (req, res) => {
    try{
        const { description, completed } = req.body;

        // Validation: ensure description is provided
    if (!description || description.trim() === "") {
      return res.status(400).json({ error: "Description is required" });
    }

                        //to talk with db
        const newaTodo = await pool.query(
            "INSERT INTO Todo (description, completed) VALUES($1, $2) RETURNING *",
            [description.trim(), completed || false]);
            //* return the newly created todo
        //send res back to frontend
        res.json(newaTodo.rows[0]);
    }

    catch (err){
        console.error(err.message);
        res.status(500).send("server Error");
    }
})

//get all data
router.get("/", async (req, res) => {
    try{
        const allTodo =  await pool.query(
            "SELECT * FROM Todo ")
            res.json(allTodo.rows);
    }

    catch (err){
        console.error(err.message);
        res.status(500).send("server Error");
    }
});

//update data
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { description, completed } = req.body;
 
    //values and handle missing properties gracefully using COALESCE or fallbacks:
    try{
        const updateTodo =  await pool.query("UPDATE Todo SET description = COALESCE($1, description), completed = COALESCE($2, completed) WHERE todo_id = $3 RETURNING *",
      [description || null, completed ?? null, id]);

         if(updateTodo.rows.length === 0){
        return res.status(404).json({ message: "Todo not found"});
         }

        res.json(updateTodo.rows[0]);
    }


    catch (err){
        console.error(err.message);
        res.status(500).send("server Error");
    }
});

//Delete a data
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try{
        const deleteTodo =  await pool.query(
            "DELETE FROM Todo WHERE todo_id = $1 RETURNING *", [id]);

        if (deleteTodo.rows.length === 0) {
            return res.status(404).json({ message: "Todo not found" });
            }

            res.json({ message: "Todo was deleted" });
    }

     catch (err){
        console.error(err.message);
        res.status(500).send("server Error");
    }
});



export default router;