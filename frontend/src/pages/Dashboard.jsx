import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Card, CardContent, Typography, Grid } from "@mui/material";

const Dashboard = () => {
  const [data, setData] = useState({});
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const [selectedUsers, setSelectedUsers] = useState({});
  const [editProjectId, setEditProjectId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
const [newUserName, setNewUserName] = useState("");
const [newUserEmail, setNewUserEmail] = useState("");
const [newUserPassword, setNewUserPassword] = useState("");
  const role = localStorage.getItem("role");

  // 🔄 Refresh Projects
  const refreshProjects = async () => {
    const res = await API.get("/projects");
    setProjects(res.data);
  };
  const createUser = async () => {
  try {
    await API.post("/auth/signup", {
      name: newUserName,
      email: newUserEmail,
      password: newUserPassword,
      role: "member"
    });

    alert("User created");

    // clear form
    setNewUserName("");
    setNewUserEmail("");
    setNewUserPassword("");

    // refresh users list
  if (role === "admin") {
  API.get("/users")
    .then((res) => setUsers(res.data))
    .catch(() => {});
}

  } catch {
    alert("Error creating user");
  }
};

  // 🔄 Load data
  useEffect(() => {
   
    API.get("/dashboard").then((res) => setData(res.data));
    refreshProjects();
    API.get("/users").then((res) => setUsers(res.data));
  }, []);

  // 🚪 Logout
  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  // ✅ Create Project WITH members
  const createProject = async () => {
    try {
      await API.post("/projects", {
        name: projectName,
        description: projectDesc,
        members: selectedMembers
      });

      alert("Project created");
      setProjectName("");
      setProjectDesc("");
      setSelectedMembers([]);
      refreshProjects();
    } catch {
      alert("Error creating project");
    }
  };

  // ✅ Add Member PER PROJECT
  const addMemberToProject = async (projectId, userId) => {
    if (!userId) {
      alert("Select user first");
      return;
    }

    try {
      await API.put("/projects/add-member", {
        projectId,
        userId
      });

      alert("Member added");
      refreshProjects();
    } catch {
      alert("Error adding member");
    }
  };

  // ✅ Update Project
  const updateProject = async () => {
    try {
      await API.put(`/projects/${editProjectId}`, {
        name: editName,
        description: editDesc
      });

      alert("Project updated");
      setEditProjectId(null);
      refreshProjects();
    } catch {
      alert("Error updating project");
    }
  };

  return (
  <>
    <button onClick={logout}>Logout</button>

    <h3>Logged in as: {role}</h3>

    {/* ================= ADMIN UI ================= */}
    {role === "admin" && (
      <>
        <h3>Create Member (Global)</h3>

        <input
          placeholder="Name"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
        />

        <input
          placeholder="Email"
          value={newUserEmail}
          onChange={(e) => setNewUserEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          value={newUserPassword}
          onChange={(e) => setNewUserPassword(e.target.value)}
        />

        <button onClick={createUser}>Add Member</button>

        <h3>Create Project</h3>

        <input
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />

        <input
          placeholder="Description"
          value={projectDesc}
          onChange={(e) => setProjectDesc(e.target.value)}
        />

        <h4>Select Members</h4>

        {users.map((user) => (
          <div key={user._id}>
            <label>
              <input
                type="checkbox"
                value={user._id}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedMembers([...selectedMembers, user._id]);
                  } else {
                    setSelectedMembers(
                      selectedMembers.filter((id) => id !== user._id)
                    );
                  }
                }}
              />
              {user.name} ({user.email})
            </label>
          </div>
        ))}

        <button onClick={createProject}>Create Project</button>
      </>
    )}

    {/* ================= MEMBER UI ================= */}
    {role === "member" && (
      <div>
        <h2>Member Dashboard</h2>
        <p>You can view your assigned projects.</p>
      </div>
    )}

    {/* ================= PROJECT LIST (COMMON) ================= */}
    <h2>Projects</h2>

    {projects.map((project) => (
      <div key={project._id} style={{ border: "1px solid gray", padding: "10px", margin: "10px" }}>
        <h3>{project.name}</h3>
        <p>{project.description}</p>

        <h4>Members:</h4>
        <ul>
          {project.members.map((member) => (
            <li key={member._id}>
              {member.name} ({member.email})
            </li>
          ))}
        </ul>

        {/* ADMIN ONLY FEATURES */}
        {role === "admin" && (
          <>
            <button
              onClick={() => {
                setEditProjectId(project._id);
                setEditName(project.name);
                setEditDesc(project.description);
              }}
            >
              Edit
            </button>

            <select
              onChange={(e) =>
                setSelectedUsers({
                  ...selectedUsers,
                  [project._id]: e.target.value
                })
              }
            >
              <option>Select User</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>

            <button
              onClick={() =>
                addMemberToProject(project._id, selectedUsers[project._id])
              }
            >
              Add Member
            </button>
          </>
        )}
      </div>
    ))}

    {/* ================= DASHBOARD ================= */}
    <Grid container spacing={2}>
      {["total", "completed", "pending", "overdue"].map((key) => (
        <Grid item xs={3} key={key}>
          <Card>
            <CardContent>
              <Typography variant="h6">{key.toUpperCase()}</Typography>
              <Typography variant="h4">{data[key] || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </>
);
};

export default Dashboard;