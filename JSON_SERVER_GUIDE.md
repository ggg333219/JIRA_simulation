# JSON Server Mock 服务配置文档

## 项目概述

本项目集成了 **json-server**，提供完整的 REST API 模拟服务，用于前端开发和测试。

## 快速开始

### 启动 Mock 服务

```bash
npm run mock
```

服务將在 `http://localhost:3001` 启动，并监听 `__json_server_mock__/db.json` 文件的变化。

### 可用的 API 端点

- **Users**: http://localhost:3001/users
- **Posts**: http://localhost:3001/posts
- **Comments**: http://localhost:3001/comments

---

## API 测试指南

### 1. GET - 获取资源列表

获取所有用户：
```bash
GET http://localhost:3001/users
```

获取单个用户：
```bash
GET http://localhost:3001/users/1
```

响应示例：
```json
[
  {
    "id": 1,
    "name": "Alice",
    "email": "alice@example.com",
    "phone": "13800138000",
    "createdAt": "2026-04-27"
  }
]
```

### 2. POST - 创建新资源

添加新用户：
```bash
POST http://localhost:3001/users
Content-Type: application/json

{
  "name": "Jack",
  "email": "jack@example.com",
  "phone": "13800138002"
}
```

响应示例：
```json
{
  "id": 3,
  "name": "Jack",
  "email": "jack@example.com",
  "phone": "13800138002"
}
```

**说明**：
- json-server 会自动生成 `id` 字段（如无指定）
- 新字段会自动添加到数据库

### 3. PATCH - 部分修改资源

修改用户名（仅修改指定字段）：
```bash
PATCH http://localhost:3001/users/1
Content-Type: application/json

{
  "name": "Rose"
}
```

响应示例：
```json
{
  "id": 1,
  "name": "Rose",
  "email": "alice@example.com",
  "phone": "13800138000",
  "createdAt": "2026-04-27"
}
```

**说明**：
- PATCH 只更新指定的字段，其他字段保持不变
- 用于部分更新操作

### 4. PUT - 完全替换资源

完全替换用户信息：
```bash
PUT http://localhost:3001/users/1
Content-Type: application/json

{
  "name": "NewName",
  "email": "new@example.com",
  "phone": "13900000000"
}
```

**说明**：
- PUT 会替换整个对象（未指定的字段会被移除）
- 通常用于完整更新

### 5. DELETE - 删除资源

删除用户：
```bash
DELETE http://localhost:3001/users/1
```

响应：返回已删除的对象

---

## 项目目录结构

```
my-app/
├── __json_server_mock__/        # Mock 数据目录
│   ├── db.json                  # 数据库文件（自动生成、自动更新）
│   └── json-server.json         # json-server 配置文件
├── package.json                 # 项目配置
└── ... (其他文件)
```

---

## db.json 数据结构

```json
{
  "users": [
    {
      "id": 1,
      "name": "Alice",
      "email": "alice@example.com",
      "phone": "13800138000",
      "createdAt": "2026-04-27"
    }
  ],
  "posts": [
    {
      "id": 1,
      "title": "Post Title",
      "content": "Post content",
      "userId": 1,
      "createdAt": "2026-04-27"
    }
  ],
  "comments": [
    {
      "id": 1,
      "text": "Comment text",
      "postId": 1,
      "userId": 1,
      "createdAt": "2026-04-27"
    }
  ]
}
```

---

## 高级功能

### 分页查询

```bash
# 获取前 10 条记录
GET http://localhost:3001/users?_limit=10

# 从第 2 页开始
GET http://localhost:3001/users?_page=2&_limit=10
```

### 排序

```bash
# 按 name 升序排列 
GET http://localhost:3001/users?_sort=name&_order=asc

# 按 id 降序排列
GET http://localhost:3001/users?_sort=id&_order=desc
```

### 过滤查询

```bash
# 查找 name 为 Alice 的用户
GET http://localhost:3001/users?name=Alice

# 多条件过滤
GET http://localhost:3001/users?name=Alice&email=alice@example.com
```

### 范围查询

```bash
# 查找 id 在指定范围内的记录
GET http://localhost:3001/users?id_gte=1&id_lte=5
```

### 全文搜索

```bash
# 在所有字段中搜索
GET http://localhost:3001/users?q=Alice
```

---

## 关系查询

### 获取包含关联数据的资源

```bash
# 获取用户及其所有帖子
GET http://localhost:3001/users/1?_embed=posts

# 获取评论及其关联的用户和帖子
GET http://localhost:3001/comments/1?_expand=user&_expand=post
```

---

## 常见 npm 命令

| 命令 | 说明 |
|------|------|
| `npm run mock` | 启动 json-server（监听文件变化）|
| `npm run mock:debug` | 调试模式启动 |

---

## 数据持久化说明

✅ **所有 API 操作都会实时持久化到 db.json：**

- **GET**: 读取数据
- **POST**: 添加新项目 → 立即保存到 db.json
- **PATCH**: 修改项目 → 立即保存到 db.json  
- **PUT**: 替换项目 → 立即保存到 db.json
- **DELETE**: 删除项目 → 立即从 db.json 移除

### 数据持久化演示

```bash
# 1. 查看初始用户列表
GET /users
→ [Alice, Bob]

# 2. 添加新用户 Jack
POST /users { "name": "Jack" }
→ db.json 自动添加 Jack
→ GET /users → [Alice, Bob, Jack]

# 3. 修改用户名为 Rose
PATCH /users/1 { "name": "Rose" }
→ db.json 自动更新
→ GET /users → [Rose, Bob, Jack]

# 4. 删除用户
DELETE /users/2
→ db.json 自动删除
→ GET /users → [Rose, Jack]
```

---

## 在 React 中使用

### 基础 HTTP 客户端配置

```javascript
// src/api/client.js
const BASE_URL = 'http://localhost:3001';

// GET 请求
export const getUsers = async () => {
  const response = await fetch(`${BASE_URL}/users`);
  return response.json();
};

// POST 请求
export const createUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return response.json();
};

// PATCH 请求
export const updateUser = async (id, userData) => {
  const response = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return response.json();
};

// DELETE 请求
export const deleteUser = async (id) => {
  const response = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'DELETE',
  });
  return response.json();
};
```

### 在 React 组件中使用

```javascript
import { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from './api/client';

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  const handleAddUser = async () => {
    const newUser = await createUser({ name: 'New User' });
    setUsers([...users, newUser]);
  };

  const handleDeleteUser = async (id) => {
    await deleteUser(id);
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div>
      <button onClick={handleAddUser}>Add User</button>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name}
            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 常见问题

### Q: 如何添加自定义数据？
A: 直接编辑 `__json_server_mock__/db.json` 文件，json-server 会自动监听文件变化。

### Q: 端口被占用怎么办？
A: 修改 `package.json` 中的启动脚本，更改 `--port` 参数：
```bash
"mock": "json-server --watch __json_server_mock__/db.json --port 3002"
```

### Q: 如何启用 CORS？
A: json-server 默认已启用 CORS，允许跨域请求。

### Q: 数据会丢失吗？
A: 不会！所有数据都实时保存到 `db.json` 文件，重启服务器后仍然存在。

---

## 参考资源

- [JSON Server 官方文档](https://github.com/typicode/json-server)
- [REST API 规范](https://restfulapi.net/)
- [HTTP 方法详解](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods)

---

## 配置完成检查清单

- ✅ json-server 已安装
- ✅ `__json_server_mock__/db.json` 已创建
- ✅ `npm run mock` 命令已配置
- ✅ 所有 CRUD 操作已测试
- ✅ 数据实时持久化已验证
