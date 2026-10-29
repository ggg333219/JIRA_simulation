#!/bin/bash
# 项目规范化配置检查脚本

echo "==================================="
echo "  工程规范化检查清单"
echo "==================================="
echo ""

# 1. ESLint 检查
echo "✓ 正在检查 ESLint 配置..."
if [ -f ".eslintrc.json" ]; then
  echo "  ✓ .eslintrc.json 已创建"
else
  echo "  ✗ .eslintrc.json 未找到"
fi

# 2. Prettier 检查
echo ""
echo "✓ 正在检查 Prettier 配置..."
if [ -f ".prettierrc.json" ]; then
  echo "  ✓ .prettierrc.json 已创建"
fi
if [ -f ".prettierignore" ]; then
  echo "  ✓ .prettierignore 已创建"
fi

# 3. CommitLint 检查
echo ""
echo "✓ 正在检查 CommitLint 配置..."
if [ -f ".commitlintrc.json" ]; then
  echo "  ✓ .commitlintrc.json 已创建"
fi

# 4. Husky 检查
echo ""
echo "✓ 正在检查 Husky Git Hooks..."
if [ -d ".husky" ]; then
  echo "  ✓ .husky 目录已创建"
  if [ -f ".husky/pre-commit" ]; then
    echo "  ✓ pre-commit hook 已配置"
  fi
  if [ -f ".husky/commit-msg" ]; then
    echo "  ✓ commit-msg hook 已配置"
  fi
fi

# 5. 依赖包检查
echo ""
echo "✓ 正在检查依赖包..."
npm list eslint prettier @commitlint/cli husky 2>/dev/null | grep -E "eslint|prettier|commitlint|husky" | head -5

echo ""
echo "==================================="
echo "  快速测试"
echo "==================================="
echo ""

echo "① 测试 ESLint..."
npm run lint 2>&1 | head -3

echo ""
echo "② 测试 Prettier..."
npm run format:check 2>&1 | head -3

echo ""
echo "③ 测试 CommitLint..."
echo "feat: test commit message" | npx commitlint

echo ""
echo "==================================="
echo "  配置完成！"
echo "==================================="
echo ""
echo "可用命令："
echo "  npm run lint          - 检查代码质量"
echo "  npm run lint:fix      - 自动修复代码"
echo "  npm run format        - 格式化代码"
echo "  npm run format:check  - 检查代码格式"
echo ""
echo "更多信息请查看 CODE_STANDARD.md"
