import React, { useEffect, useState } from 'react';
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://to-do-list-fgi8.onrender.com";

const App = () => {
    const [description, setDescription] = useState("");
    const [todos, setTodo] = useState([]);
    const [editTodoId, setEditTodoId] = useState(null);

    const getTodo = async () => {
        try {
            const res = await axios.get(`${API_BASE}/todos`);
            setTodo(res.data);  
        } catch (err) {
            console.error("Fetch Error:", err.message);
        }
    };
    
    useEffect(() => {
        getTodo();
    }, []);

    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {
            if (editTodoId) {
                await axios.put(`${API_BASE}/todos/${editTodoId}`, { 
                    description, 
                    completed: false 
                });
                setEditTodoId(null);
            } else {
                await axios.post(`${API_BASE}/todos`, { 
                    description, 
                    completed: false 
                });
            }
            await getTodo();
            setDescription("");
        } catch (err) {
            console.error("Submit Error:", err.message);
        }
    };

    const deleteTodo = async (todo) => {
        // Fallback check to support either todo_id or id returned from Express
        const idToDelete = todo.todo_id || todo.id;
        
        if (!idToDelete) {
            console.error("No valid ID found on todo object:", todo);
            return;
        }

        try {
            await axios.delete(`${API_BASE}/todos/${idToDelete}`);
            await getTodo();
        } catch (err) {
            console.error("Delete Error:", err.message);
        }
    };

    const handleEditClick = (todo) => {
        const idToEdit = todo.todo_id || todo.id;
        setEditTodoId(idToEdit);
        setDescription(todo.description);
    };

    const toggleComplete = async (todo) => {
        const idToToggle = todo.todo_id || todo.id;
        try {
            await axios.put(`${API_BASE}/todos/${idToToggle}`, {
                description: todo.description,
                completed: !todo.completed
            });
            await getTodo();
        } catch (err) {
            console.error("Toggle Error:", err.message);
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
                    <button type="submit" className={`${editTodoId ? "bg-yellow-500" : "bg-blue-600"} text-white px-4 py-2 rounded`}>
                        {editTodoId ? "Update Task" : "Add Task"}
                    </button>
                </div>
            </form>

            <div>
                {todos.length === 0 ? (
                    <p className="text-gray-600">No task available</p>
                ) : (
                    <div>
                        {todos.map((todo, index) => {
                            // Unique key fallback mechanism
                            const itemKey = todo.todo_id || todo.id || index;

                            return (
                                <div key={itemKey} className="flex items-center justify-between p-2 my-2 border-b">
                                    <div className="flex items-center gap-3">
                                        <button 
                                            type="button" 
                                            onClick={() => toggleComplete(todo)} 
                                            className={`w-5 h-5 rounded-full border flex items-center justify-center cursor-pointer ${todo.completed ? "bg-green-500 border-green-500 text-white" : "border-gray-300"}`}
                                        >
                                            {todo.completed && "✓"}
                                        </button>

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
                                            onClick={() => deleteTodo(todo)}
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