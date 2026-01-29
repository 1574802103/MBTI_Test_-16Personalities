@echo off
chcp 65001 >nul
title MBTI 项目验证

echo ========================================================
echo        正在执行 MBTI 项目全量验证...
echo ========================================================
echo.

cd /d "%~dp0"

if not exist "node_runtime\node-v20.11.0-win-x64\node.exe" (
    echo [错误] 未检测到便携 Node.js 运行时，请先运行“启动程序.bat”完成配置。
    pause
    exit /b 1
)

set "NODE_HOME=%~dp0node_runtime\node-v20.11.0-win-x64"
set "PATH=%NODE_HOME%;%PATH%"

if not exist "node_modules" (
    echo [提示] 检测到未安装依赖，正在执行 npm ci...
    call npm ci
    if errorlevel 1 (
        echo [错误] 依赖安装失败，请检查网络环境。
        pause
        exit /b 1
    )
    echo [成功] 依赖安装完成！
    echo.
)

echo [提示] 开始执行：TypeScript 校验 + ESLint + 单元测试 + 生产构建
echo.

call npm run verify
if errorlevel 1 (
    echo.
    echo [错误] 验证未通过，请检查以上输出。
    pause
    exit /b 1
)

echo.
echo [成功] 验证通过！
pause
