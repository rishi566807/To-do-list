import express from 'express';
import cors from 'cors'; // Allows your React frontend to communicate with Express
import todoRoutes from "./routes/todo.js";

const app = express();

app.use(cors());
app.use(express.json());// Parses incoming JSON data in request bodies


app.use("/todos", todoRoutes);


app.listen(3000, () => {
    console.log("server listening on http://localhost:3000");
})