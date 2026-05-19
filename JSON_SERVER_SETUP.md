# JSON Server 配置总结

## ✅ 配置完成

json-server 已成功集成到项目中！

### 📦 安装内容

- ✅ `json-server` 依赖已安装
- ✅ `__json_server_mock__/` 目录已创建
- ✅ `__json_server_mock__/db.json` 数据文件已创建
- ✅ `npm run mock` 启动脚本已配置
- ✅ 所有 CRUD 操作已测试通过
- ✅ 数据实时持久化已验证

---

## 🚀 快速开始

### 启动 Mock 服务

**终端1 - 启动 JSON Server：**
```bash
npm run mock
```

输出示例：
```
JSON Server started on PORT :3001
Watching __json_server_mock__/db.json...

Endpoints:
http://localhost:3001/users
http://localhost:3001/posts
http://localhost:3001/comments
```

### 测试 API

**终端2 - 执行测试：**

#### 方式 1: 使用测试脚本（推荐）
```bash
# Linux/Mac
bash test-api.sh

# Windows
test-api.bat
```

#### 方式 2: 手动测试

```bash
# GET - 获取所有用户
curl http://localhost:3001/users

# POST - 添加新用户
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Jack"}'

# PATCH - 修改用户
curl -X PATCH http://localhost:3001/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Rose"}'

# DELETE - 删除用户
curl -X DELETE http://localhost:3001/users/1
```

---

## 📋 测试验证结果

### ✅ 所有操作已测试通过

| 操作 | 状态 | 结果 |
|------|------|------|
| GET /users | ✅ | 成功获取用户列表（2 个用户） |
| POST /users | ✅ | 成功添加新用户 Jack |
| 重新 GET /users | ✅ | 新用户已添加（3 个用户） |
| PATCH /users/1 | ✅ | 成功将 Alice 改名为 Rose |
| DELETE /users/2 | ✅ | 成功删除用户 Bob |
| 最终验证 | ✅ | 剩余 2 个用户（Rose + Jack） |

### 📊 数据持久化验证

`db.json` 文件已自动更新：
- ✅ Alice → Rose（修改）
- ✅ Bob（删除）
- ✅ Jack（新增）

---

## 📂 项目结构

```
my-app/
├── __json_server_mock__/
│   ├── db.json                    # 数据库文件（自动更新）
│   └── json-server.json           # json-server 配置
├── package.json                   # 脚本配置
├── JSON_SERVER_GUIDE.md           # 完整使用文档
├── test-api.sh                    # API 测试脚本 (Linux/Mac)
├── test-api.bat                   # API 测试脚本 (Windows)
└── ... (其他文件)
```

---

## 💡 常用命令

```bash
# 启动 Mock 服务（默认 3001 端口）
npm run mock

# 调试模式启动
npm run mock:debug

# 代码检查和格式化（之前配置的）
npm run lint
npm run format
npm run lint:fix
npm run format:check
```

---

## 📖 核心 API 操作

### 数据库资源
- `/users` - 用户资源
- `/posts` - 帖子资源  
- `/comments` - 评论资源

### HTTP 方法

| 方法 | URL | 说明 | 数据是否持久化 |
|------|-----|------|--------------|
| GET | `/users` | 获取所有用户 | - |
| GET | `/users/1` | 获取单个用户 | - |
| POST | `/users` | 创建新用户 | ✅ 自动保存 |
| PUT | `/users/1` | 完整替换用户 | ✅ 自动保存 |
| PATCH | `/users/1` | 部分修改用户 | ✅ 自动保存 |
| DELETE | `/users/1` | 删除用户 | ✅ 自动删除 |

### 高级查询

```bash
# 分页
GET /users?_page=1&_limit=10

# 排序
GET /users?_sort=name&_order=asc

# 过滤
GET /users?name=Alice

# 范围
GET /users?id_gte=1&id_lte=5

# 搜索
GET /users?q=alice
```

---

## 🔗 在 React 中集成

### 配置 API 基础 URL

```javascript
// 开发环境
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// 生产环境
// const API_BASE_URL = 'https://api.example.com';
```

### 创建 API 客户端

```javascript
// src/services/api.js
export const api = {
  // GET
  getUsers: () => fetch(`${API_BASE_URL}/users`).then(r => r.json()),
  
  // POST
  createUser: (data) => fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  
  // PATCH
  updateUser: (id, data) => fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  
  // DELETE
  deleteUser: (id) => fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE'
  }).then(r => r.json())
};
```

### 在组件中使用

```javascript
import { useEffect, useState } from 'react';
import { api } from './services/api';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>加载中...</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

export default UserList;
```

---

## ⚙️ 配置文件说明

### `__json_server_mock__/db.json`

数据库文件，存储所有资源数据。每次 API 操作（POST/PATCH/DELETE）会自动更新此文件。

```json
{
  "users": [],
  "posts": [],
  "comments": []
}
```

### `__json_server_mock__/json-server.json`

json-server 配置文件：
```json
{
  "port": 3001,
  "host": "localhost",
  "watch": true
}
```

### `package.json` scripts

```json
{
  "scripts": {
    "mock": "json-server --watch __json_server_mock__/db.json --port 3001",
    "mock:debug": "json-server --watch __json_server_mock__/db.json --port 3001 --id id"
  }
}
```

---

## 🆘 常见问题

### Q: 如何修改端口？
A: 编辑 `package.json`：
```json
"mock": "json-server --watch __json_server_mock__/db.json --port 3002"
```

### Q: 如何重置数据？
A: 编辑 `__json_server_mock__/db.json`，恢复原始数据。

### Q: 数据安全吗？
A: ✅ 数据实时保存到 `db.json` 文件，不会丢失。

### Q: 可以用于生产？
A: ❌ json-server 仅用于开发和测试。生产环境应使用真实后端 API。

### Q: 如何添加新的资源类型？
A: 在 `db.json` 中添加新的字段即可：
```json
{
  "users": [...],
  "products": [...]
}
```

---

## 📚 相关文档

- [JSON_SERVER_GUIDE.md](JSON_SERVER_GUIDE.md) - 详细使用指南
- [CODE_STANDARD.md](CODE_STANDARD.md) - 代码规范指南
- [官方 json-server 文档](https://github.com/typicode/json-server)

---

## ✨ 配置要点回顾

| 项目 | 说明 | 文件位置 |
|------|------|--------|
| Mock 服务 | 在 3001 端口启动 | `npm run mock` |
| 数据库 | JSON 格式，自动持久化 | `__json_server_mock__/db.json` |
| CRUD 操作 | 所有操作实时反映 | 自动保存 |
| 测试脚本 | 快速验证 API | `test-api.sh`/`test-api.bat` |
| 完整文档 | 详细使用说明 | `JSON_SERVER_GUIDE.md` |

---

**配置完成时间**：2026-04-27  
**json-server 版本**：已安装最新版  
**测试状态**：✅ 所有功能已验证
