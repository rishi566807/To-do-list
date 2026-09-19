import express from 'express';
import cors from 'cors'; // Allows your React frontend to communicate with Express
import todoRoutes from "./routes/todo.js";

const app = express();

app.use(cors());
app.use(express.json());// Parses incoming JSON data in request bodies


app.use("/todos", todoRoutes);

// Render injects its own port via process.env.PORT (defaults to 10000 on Render)
const PORT = process.env.PORT || 3000;


// Binding to '0.0.0.0' is required for Render's port scanner to detect the active service
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
});