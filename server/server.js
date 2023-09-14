const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "haianh123",
  database: "todolist-hakthon",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    throw err;
  }
  console.log("Connected to MySQL");
});

app.use(bodyParser.json());
app.use(cors());

// API để tạo công việc mới
app.post("/api/v1/todo", (req, res) => {
  const { name, status } = req.body;
  const query = "INSERT INTO todo (name, status) VALUES (?, ?)";
  connection.query(query, [name, status], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(201).json({ id: result.insertId, name, status });
    }
  });
});

// API để lấy danh sách tất cả công việc
app.get("/api/v1/todo", (req, res) => {
  const query = "SELECT * FROM todo";
  connection.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(results);
    }
  });
});

// API để cập nhật công việc thành hoàn thành
app.put("/api/v1/todo/:id/complete", (req, res) => {
  const todoId = req.params.id;
  const query = "UPDATE todo SET status = ? WHERE id = ?";
  connection.query(query, ["complete", todoId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json({ id: todoId, status: "complete" });
    }
  });
});

// API để xóa một công việc
app.delete("/api/v1/todo/:id", (req, res) => {
  const todoId = req.params.id;
  const query = "DELETE FROM todo WHERE id = ?";
  connection.query(query, [todoId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(204).end();
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
