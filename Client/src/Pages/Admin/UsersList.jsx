// src/Pages/Admin/UsersList.jsx

import React, { useEffect, useState } from 'react';
// import style from './Admin.module.scss'; // Sử dụng style chung nếu cần

export default function UsersList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 💡 GỌI API LẤY DANH SÁCH NGƯỜI DÙNG
        fetch('http://localhost:5000/api/admin/users') // Thay bằng API endpoint thực tế
            .then(res => res.json())
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch users failed:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Đang tải danh sách người dùng...</div>;

    return (
        <div className="usersList">
            <h3>Quản lý Người dùng</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>SĐT</th>
                        <th>Role</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.user_id}>
                            <td>{user.user_id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone || 'N/A'}</td>
                            <td>{user.role}</td>
                            <td>
                                <button>Chỉnh sửa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}