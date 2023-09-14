import React, { useEffect, useState } from "react";
import axios from "axios";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/todo");
        setTodos(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTodos();
  }, []);

  const addTodo = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/v1/todo", {
        name: newTodo,
        status: "uncomplete",
      });
      setTodos([...todos, response.data]);
      setNewTodo("");
    } catch (error) {
      console.error(error);
    }
  };

  const markComplete = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/v1/todo/${id}/complete`);
      const updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, status: "complete" } : todo
      );
      setTodos(updatedTodos);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/todo/${id}`);
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      setTodos(updatedTodos);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1>TODOLIST</h1>
      <div className="row">
        <div className="col-6">
          <h2>Uncompleted Tasks</h2>
          <ul>
            {todos
              .filter((todo) => todo.status === "uncomplete")
              .map((todo) => (
                <li key={todo.id}>
                  <span>{todo.name}</span>
                  <span>
                    <button onClick={() => markComplete(todo.id)}>
                      Hoàn thành
                    </button>
                    <button onClick={() => deleteTodo(todo.id)}>Xóa</button>
                  </span>
                </li>
              ))}
          </ul>
        </div>
        <div className="col-6">
          <h2>Completed Tasks</h2>
          <ul>
            {todos
              .filter((todo) => todo.status === "complete")
              .map((todo) => (
                <li key={todo.id}>
                  <span>{todo.name}</span>
                  <span>
                    <button>Đã hoàn thành</button>
                    <button onClick={() => deleteTodo(todo.id)}>Xóa</button>
                  </span>
                </li>
              ))}
          </ul>
        </div>
        <div className="btn">
          <input
            className="add-task"
            type="text"
            placeholder="Thêm công việc mới"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
        </div>
        <div className="btn">
          <button className="add-btn" onClick={addTodo}>
            Thêm công việc mới
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoList;
