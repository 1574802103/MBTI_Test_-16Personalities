@echo off
chcp 65001 >nul
title MBTI性格测试启动器

echo ========================================================
echo        正在启动 MBTI 性格测试应用...
echo ========================================================
echo.

cd /d "%~dp0"

:: 检查是否需要下载 Node.js 运行时
if not exist "node_runtime\node-v20.11.0-win-x64\node.exe" (
    echo [提示] 未检测到 Node.js 环境，正在自动下载配置...
    echo [注意] 此过程需要联网，请保持网络连接。
    powershell -ExecutionPolicy Bypass -File "setup_runtime.ps1"
    if errorlevel 1 (
        echo [错误] 自动配置环境失败，请检查网络后重试。
        pause
        exit /b
    )
    echo [成功] 环境配置完成！
    echo.
)

:: 设置临时环境变量
set "NODE_HOME=%~dp0node_runtime\node-v20.11.0-win-x64"
set "PATH=%NODE_HOME%;%PATH%"

:: 检查是否已安装依赖
if not exist "node_modules" (
    echo [提示] 检测到首次运行，正在安装必要的依赖库...
    call npm install
    if errorlevel 1 (
        echo [错误] 依赖安装失败，请检查网络环境。
        pause
        exit /b
    )
    echo [成功] 依赖安装完成！
    echo.
)

echo [提示] 正在启动本地服务器...
echo [提示] 浏览器将自动打开，请勿关闭此窗口...
echo.

:: 启动服务并自动打开浏览器
call npm run dev -- --open

:: 如果服务异常退出，暂停显示错误信息
pause
