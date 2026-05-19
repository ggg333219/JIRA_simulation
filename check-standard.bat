@echo off
REM 项目规范化配置检查脚本 (Windows 版本)

echo.
echo ===================================
echo   工程规范化配置检查
echo ===================================
echo.

REM 1. ESLint 检查
echo ✓ 检查 ESLint 配置...
if exist ".eslintrc.json" (
    echo   ✓ .eslintrc.json 已创建
) else (
    echo   ✗ .eslintrc.json 未找到
)

REM 2. Prettier 检查
echo.
echo ✓ 检查 Prettier 配置...
if exist ".prettierrc.json" (
    echo   ✓ .prettierrc.json 已创建
)
if exist ".prettierignore" (
    echo   ✓ .prettierignore 已创建
)

REM 3. CommitLint 检查
echo.
echo ✓ 检查 CommitLint 配置...
if exist ".commitlintrc.json" (
    echo   ✓ .commitlintrc.json 已创建
)

REM 4. Husky 检查
echo.
echo ✓ 检查 Husky Git Hooks...
if exist ".husky" (
    echo   ✓ .husky 目录已创建
    if exist ".husky\pre-commit" (
        echo   ✓ pre-commit hook 已配置
    )
    if exist ".husky\commit-msg" (
        echo   ✓ commit-msg hook 已配置
    )
)

REM 5. EditorConfig 检查
echo.
echo ✓ 检查 EditorConfig 配置...
if exist ".editorconfig" (
    echo   ✓ .editorconfig 已创建
)

REM 6. VS Code 配置检查
echo.
echo ✓ 检查 VS Code 配置...
if exist ".vscode\settings.json" (
    echo   ✓ .vscode\settings.json 已创建
)

echo.
echo ===================================
echo   可用 NPM 命令
echo ===================================
echo.
echo   npm run lint          - 检查代码质量
echo   npm run lint:fix      - 自动修复代码
echo   npm run format        - 格式化代码
echo   npm run format:check  - 检查代码格式
echo.
echo ===================================
echo   Git 工作流
echo ===================================
echo.
echo   1. 修改代码后运行: npm run format
echo   2. 提交代码: git commit -m "type: message"
echo      * 自动触发 pre-commit 检查 (npm run lint)
echo      * 自动触发 commit-msg 检查 (commitlint)
echo.
echo 配置文件说明详见: CODE_STANDARD.md
echo.
