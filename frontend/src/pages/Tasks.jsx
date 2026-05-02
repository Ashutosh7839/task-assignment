import React, { useEffect, useState } from "react";
import API from "../services/api";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const role = localStorage.getItem("role");
  useEffect(() => {
    API.get("/tasks").then((res) => setTasks(res.data));
  }, []);

  const updateStatus = async (id, status) => {
    await API.put(`/tasks/${id}`, { status });
    window.location.reload();
  };

  return (
    <div>
      {/* {role === "admin" && (
        <div>
          <h3>Assign Task</h3>
          <input placeholder="Title" />
          <button>Create Task</button>
        </div>
      )} */}
      <h2>Tasks</h2>

      {tasks.map((task) => (
        <div key={task._id}>
          <p>{task.title}</p>

          {/* Member can update */}
          {role === "member" && (
            <select
              value={task.status}
              onChange={(e) => updateStatus(task._id, e.target.value)}
            >
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          )}

          {/* Admin just sees */}
          {role === "admin" && <p>Status: {task.status}</p>}
        </div>
      ))}
    </div>
  );
};

export default Tasks;
