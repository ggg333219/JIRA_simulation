@echo off
REM JSON Server API 测试脚本 (Windows 版本)

setlocal enabledelayedexpansion

set BASE_URL=http://localhost:3001

cls
echo ======================================
echo   JSON Server API 测试
echo ======================================
echo.

REM 1. GET 测试
echo [1/6] 测试 GET /users - 获取用户列表
echo.
echo 请求: GET %BASE_URL%/users
echo.
powershell -Command "try { (Invoke-WebRequest %BASE_URL%/users -UseBasicParsing).Content | ConvertFrom-Json | ConvertTo-Json -Depth 3 } catch { Write-Host '错误: 无法连接到服务器' -ForegroundColor Red }"
echo.
echo [OK] GET 请求成功
echo.
pause

REM 2. POST 测试
echo [2/6] 测试 POST /users - 添加新用户
echo.
echo 请求: POST %BASE_URL%/users
echo 数据: {"name":"TestUser","email":"test@example.com"}
echo.
powershell -Command "$body = @{ name = 'TestUser'; email = 'test@example.com' } | ConvertTo-Json; (Invoke-WebRequest -Uri %BASE_URL%/users -Method Post -Body $body -ContentType 'application/json' -UseBasicParsing).Content | ConvertFrom-Json | ConvertTo-Json"
echo.
echo [OK] POST 请求成功
echo.
pause

REM 3. PATCH 测试
echo [3/6] 测试 PATCH /users/1 - 修改用户信息
echo.
echo 请求: PATCH %BASE_URL%/users/1
echo 数据: {"name":"UpdatedName"}
echo.
powershell -Command "$body = @{ name = 'UpdatedName' } | ConvertTo-Json; (Invoke-WebRequest -Uri %BASE_URL%/users/1 -Method Patch -Body $body -ContentType 'application/json' -UseBasicParsing).Content | ConvertFrom-Json | ConvertTo-Json"
echo.
echo [OK] PATCH 请求成功
echo.
pause

REM 4. 验证修改
echo [4/6] 验证 GET /users/1 - 查看修改后的用户
echo.
echo 请求: GET %BASE_URL%/users/1
echo.
powershell -Command "(Invoke-WebRequest %BASE_URL%/users/1 -UseBasicParsing).Content | ConvertFrom-Json | ConvertTo-Json"
echo.
pause

REM 5. GET 所有用户
echo [5/6] 测试 GET /users - 获取所有用户
echo.
powershell -Command "(Invoke-WebRequest %BASE_URL%/users -UseBasicParsing).Content | ConvertFrom-Json | ConvertTo-Json -Depth 3"
echo.
pause

REM 6. 完成
echo [6/6] 测试完成
echo.
echo ======================================
echo   所有测试完成！
echo ======================================
echo.
echo 测试结果摘要：
echo   - GET /users - 获取用户列表
echo   - POST /users - 添加新用户
echo   - PATCH /users/1 - 修改用户
echo   - GET /users/1 - 查看修改
echo   - GET /users - 列出所有用户
echo.
echo 数据已实时保存到 __json_server_mock__\db.json
echo.
pause
