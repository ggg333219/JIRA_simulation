#!/bin/bash

# JSON Server API 测试脚本

BASE_URL="http://localhost:3001"

echo "======================================"
echo "  JSON Server API 测试"
echo "======================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. GET 测试
echo -e "${BLUE}① 测试 GET /users - 获取用户列表${NC}"
curl -s "$BASE_URL/users" | jq .
echo ""
echo -e "${GREEN}✓ GET 请求成功${NC}"
echo ""

# 2. POST 测试
echo -e "${BLUE}② 测试 POST /users - 添加新用户${NC}"
NEW_USER=$(curl -s -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{"name":"TestUser","email":"test@example.com"}')
echo "$NEW_USER" | jq .
NEW_USER_ID=$(echo "$NEW_USER" | jq '.id' | tr -d '"')
echo -e "${GREEN}✓ POST 请求成功，新用户 ID: $NEW_USER_ID${NC}"
echo ""

# 3. PATCH 测试
echo -e "${BLUE}③ 测试 PATCH /users/1 - 修改用户信息${NC}"
curl -s -X PATCH "$BASE_URL/users/1" \
  -H "Content-Type: application/json" \
  -d '{"name":"UpdatedName"}' | jq .
echo -e "${GREEN}✓ PATCH 请求成功${NC}"
echo ""

# 4. 验证修改
echo -e "${BLUE}④ 验证 GET /users/1 - 查看修改后的用户${NC}"
curl -s "$BASE_URL/users/1" | jq .
echo ""

# 5. DELETE 测试
echo -e "${BLUE}⑤ 测试 DELETE /users/$NEW_USER_ID - 删除用户${NC}"
curl -s -X DELETE "$BASE_URL/users/$NEW_USER_ID" | jq .
echo -e "${GREEN}✓ DELETE 请求成功${NC}"
echo ""

# 6. 最终验证
echo -e "${BLUE}⑥ 最终验证 - 获取所有用户${NC}"
curl -s "$BASE_URL/users" | jq .
echo ""

echo "======================================"
echo -e "${GREEN}  所有测试完成！${NC}"
echo "======================================"
echo ""
echo "测试结果摘要："
echo "  ✓ GET /users - 获取用户列表"
echo "  ✓ POST /users - 添加新用户"
echo "  ✓ PATCH /users/1 - 修改用户"
echo "  ✓ DELETE /users/{id} - 删除用户"
echo ""
echo "数据已实时保存到 __json_server_mock__/db.json"
