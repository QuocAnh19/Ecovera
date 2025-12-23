import React, { useState, useEffect } from "react";
import style from "./Users.module.scss";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Get the list of users
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/users/all");
      
      if (!response.ok) {
        throw new Error("Unable to fetch data from server");
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err.message);
    }
  };

  // Changing Roles
  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Confirm changing role to ${newRole}?`)) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/update-role/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error("Update failed");
      }

      // Update the state in place so the UI changes immediately.
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.user_id === userId ? { ...u, role: newRole } : u))
      );
      
      alert("Permissions updated successfully!");
    } catch (err) {
      console.error("Role update error:", err.message);
      alert("An error occurred while saving to the database.");
    }
  };

  return (
    <div className={style.container}>
      <h4>User management</h4>
      <div className={style.tableWrapper}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>ID / Name</th>
              <th>Email / Phone</th>
              <th>Address</th>
              <th>Date joined</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.user_id}>
                  <td>
                    <img 
                      src={user.image ? `http://localhost:5000/uploads/Dashboard/${user.image}` : "/default-avatar.png"}
                      className={style.avatar} 
                      alt="avatar" 
                      onError={(e) => e.target.src = "https://via.placeholder.com/45"}
                    />
                  </td>
                  <td>
                    <div className={style.nameGroup}>
                      <strong>{user.user_id}</strong>
                      <p>{user.name}</p>
                    </div>
                  </td>
                  <td>
                    <p>{user.email}</p>
                    <small>{user.phone || "Not updated"}</small>
                  </td>
                  <td>
                    <span className={style.address} title={user.address}>
                      {user.address || "N/A"}
                    </span>
                  </td>
                  <td>{new Date(user.created_at).toLocaleDateString("vi-VN")}</td>
                  <td>
                    <select
                      className={`${style.roleSelect} ${style[user.role]}`}
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.user_id, e.target.value)}
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>
                  Loading or no user...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}