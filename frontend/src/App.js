import React, { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";

function App() {
  const [auth, setAuth] = useState(!!localStorage.getItem("token"));
const role = localStorage.getItem("role");
  if (!auth) return <Login setAuth={setAuth} />;

  return (
    <div>
      <h1>Team Task Manager</h1>
      <Dashboard />
      <Tasks />
    </div>
  );
}

export default App;