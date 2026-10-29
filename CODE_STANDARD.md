# 工程代码规范配置指南

## 项目已配置的规范化工具

本项目集成了以下三个核心代码规范工具：

### 1. ESLint - 代码质量检查
**配置文件**: `.eslintrc.json`

ESLint 用于检查 JavaScript 代码的语法错误和编程规范。

主要规则：
- ✅ React Hook 规则强制执行
- ✅ 禁止使用 console.log（warn/error 除外）
- ✅ 检查未使用的变量
- ✅ JSX 语法检查

### 2. Prettier - 代码格式化
**配置文件**: `.prettierrc.json`

Prettier 自动格式化代码，确保整个项目的代码风格一致。

主要配置：
- ✅ 使用单引号 (singleQuote)
- ✅ 行宽限制 80 字符 (printWidth)
- ✅ 制表符宽度 2 空格 (tabWidth)
- ✅ 自动添加末尾逗号 (trailingComma: es5)
- ✅ 使用 LF 作为换行符 (endOfLine: lf)

### 3. CommitLint - Commit 消息规范
**配置文件**: `.commitlintrc.json`

CommitLint 确保 git commit 消息遵循规范格式。

Commit 类型规范：
- `feat`: 新功能
- `fix`: 问题修复
- `docs`: 文档更新
- `style`: 代码风格调整（不影响功能）
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 其他更改（如依赖更新）
- `ci`: CI/CD 配置更新
- `revert`: 撤销之前的提交

**Commit 消息格式**:
```
<type>(<scope>)?: <subject>

Examples:
✅ feat: add user login functionality
✅ fix: correct button click handler
✅ docs: update README
✅ style: format code with prettier
```

---

## 常用命令

### 代码检查
```bash
# 检查代码质量
npm run lint

# 自动修复 ESLint 问题
npm run lint:fix

# 检查代码格式
npm run format:check

# 自动格式化代码
npm run format
```

### Git 提交流程

```bash
# 1. 修改代码
# 2. 暂存更改
git add .

# 3. 提交（会自动触发 pre-commit 钩子进行 lint 检查）
git commit -m "feat: add new feature"
# 或
git commit -m "fix: resolve bug"

# commit-msg 钩子会自动验证 commit 消息格式
```

---

## Git Hooks 自动化

项目使用 **Husky** 管理 git 钩子，自动在关键时刻执行检查：

### pre-commit
- **触发时机**: exec git commit 时
- **执行操作**: 运行 `npm run lint`
- **作用**: 防止有 lint 错误的代码被提交

### commit-msg
- **触发时机**: commit 消息输入完成时
- **执行操作**: 运行 commitlint 验证消息格式
- **作用**: 确保所有 commit 消息格式正确

---

## 文件说明

```
.eslintrc.json          # ESLint 配置文件
.eslintignore           # ESLint 忽略文件列表
.prettierrc.json        # Prettier 配置文件
.prettierignore         # Prettier 忽略文件列表
.commitlintrc.json      # CommitLint 配置文件
.husky/                 # Git hooks 目录
  ├── pre-commit        # 提交前检查
  └── commit-msg        # commit 消息检查
```

---

## 工作流示例

```bash
# 1. 创建功能分支
git checkout -b feat/new-feature

# 2. 编写代码
# ... 修改文件 ...

# 3. 检查并修复代码格式
npm run format
npm run lint:fix

# 4. 暂存更改
git add .

# 5. 提交（自动检查）
git commit -m "feat: add new feature"
# pre-commit 钩子自动运行 npm run lint
# commit-msg 钩子自动验证消息格式

# 6. 推送到远程仓库
git push origin feat/new-feature
```

---

## 常见问题

### Q: 提交时被 pre-commit 钩子拒绝怎么办？
**A**: 需要先修复 lint 错误：
```bash
npm run lint:fix
git add .
git commit -m "your message"
```

### Q: 提交消息格式错误怎么办？
**A**: CommitLint 会提示错误。使用正确的格式：
```bash
# ❌ 错误: This is my commit
# ✅ 正确: feat: add new feature
git commit -m "feat: add new feature"
```

### Q: 想跳过钩子（不推荐）？
```bash
# 跳过 pre-commit 钩子
git commit --no-verify -m "feat: message"

# 但这会破坏代码质量保障，不推荐使用！
```

---

## IDE 配置建议

### VS Code
安装以下扩展以获得最佳体验：
- **ESLint**: dbaeumer.vscode-eslint
- **Prettier**: esbenp.prettier-vscode
- **Commit Message Editor**: adam-bender.commit-message-editor

### 编辑器设置
在 VS Code 的 `settings.json` 中添加：
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "eslint.validate": ["javascript", "javascriptreact"],
  "eslint.run": "onSave"
}
```

---

## 总结

✅ **ESLint**: 检查代码质量  
✅ **Prettier**: 统一代码格式  
✅ **CommitLint**: 规范提交消息  
✅ **Husky**: 自动化执行检查  

这样的配置确保了代码库的高质量和一致性！
