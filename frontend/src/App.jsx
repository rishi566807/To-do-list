import React, { useEffect, useState } from 'react';
import axios from "axios";

// Render base backend URL (fallback to local if running offline)
const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://to-do-list-fgi8.onrender.com";

const App = () => {
    // to save input box data
    const [description, setDescription] = useState("");
    // to save all data
    const [todos, setTodo] = useState([]);
    // to save editing data
    const [editTodoId, setEditTodoId] = useState(null);

    // get all data
    const getTodo = async () => {
        try {
            const res = await axios.get(`${API_BASE}/todos`);
            setTodo(res.data);  
        } catch (err) {
            console.error(err.message);
        }
    };
    
    // Run when loads on the browser
    useEffect(() => {
        getTodo();
    }, []);

    // Add data
    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE}/todos`, { description, completed: false });
            await getTodo(); // Re-fetch from DB to sync UI immediately
            setDescription(""); // Clear the input field
        } catch (err) {
            console.error(err.message);
        }
    };

    // delete data
    const deleteTodo = async (id) => {
        try {
            await axios.delete(`${API_BASE}/todos/${id}`);
            getTodo(); // fetching all data again after deleting 
        } catch (err) {
            console.error(err.message);
        }
    };

    // main input box with existing todo text to edit
    const handleEditClick = (todo) => {
        setEditTodoId(todo.todo_id);
        setDescription(todo.description);
    };

    // Toggle completion status in backend
    const toggleComplete = async (todo) => {
        try {
            await axios.put(`${API_BASE}/todos/${todo.todo_id}`, {
                description: todo.description,
                completed: !todo.completed
            });
            await getTodo(); // Sync state with database
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-4">
            <h1 className="text-2xl font-bold text-center mb-4">PERN TODO APP</h1>
            
            <form onSubmit={onSubmitForm}>
                <div className="flex gap-2 mb-4">
                    <input 
                        type="text" 
                        placeholder="Type todo"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="flex-1 border p-2 rounded"
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                        Add Task
                    </button>
                </div>
            </form>

            <div>
                {todos.length === 0 ? (
                    <p className="text-gray-600">No task available</p>
                ) : (
                    <div>
                        {todos.map((todo) => {
                            return (
                                <div key={todo.todo_id} className="flex items-center justify-between p-2 my-2">
                                    <div className="flex items-center gap-3">
                                        {/* Circle Checkbox */}
                                        <button 
                                            type="button" 
                                            onClick={() => toggleComplete(todo)} 
                                            className={`w-5 h-5 rounded-full border flex items-center justify-center cursor-pointer ${todo.completed ? "bg-green-500 border-green-500 text-white" : "border-gray-300"}`}
                                        >
                                            {todo.completed && "✓"}
                                        </button>

                                        {/* Todo Text */}
                                        <span className={todo.completed ? "line-through text-gray-400" : "text-gray-800"}>
                                            {todo.description}
                                        </span>
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <button 
                                            type="button" 
                                            className="bg-yellow-500 text-white px-3 py-1 rounded cursor-pointer"
                                            onClick={() => handleEditClick(todo)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            type="button" 
                                            className="bg-red-600 text-white px-3 py-1 rounded cursor-pointer"
                                            onClick={() => deleteTodo(todo.todo_id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;