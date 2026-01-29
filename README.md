# MBTI 性格测试应用

基于 React + TypeScript + Vite 构建的现代化 MBTI 性格测试应用。

## 功能特性

*   **三种测试模式**：
    *   快速版（28题）：快速评估，适合时间有限的用户。
    *   标准版（93题）：平衡深度与时间，适合大多数用户。
    *   完整版（200题）：题量更大，提供更细致的四维偏好分析。
*   **计分算法**：基于四个维度（E/I、S/N、T/F、J/P）进行计分与类型归类，并对“接近中间型（X）”的维度做标记，便于提示与后续扩展。
*   **本地化存储**：测试进度自动保存到浏览器本地存储，随时中断继续。
*   **响应式设计**：完美适配桌面和移动端设备。
*   **绿色便携**：内置便携式 Node.js 运行时，无需安装依赖即可运行。

## 重要说明

本项目为学习与自我探索用途的非官方性格测评工具，不属于 MBTI® 官方量表与报告体系；结果仅供参考。

## 技术栈

*   **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion
*   **Build Tool**: Vite
*   **Testing**: Vitest
*   **Visualization**: Chart.js

## 快速开始

### Windows 用户（推荐）

直接双击根目录下的 `启动程序.bat` 即可运行。程序会自动检测环境并启动。

### 开发者

1.  安装依赖：
    ```bash
    npm install
    ```

2.  启动开发服务器：
    ```bash
    npm run dev
    ```

3.  运行测试：
    ```bash
    npm run test
    # 或使用便携运行时
    .\node_runtime\node-v20.11.0-win-x64\npx.cmd vitest run
    ```

## 代码结构优化 (2025-01-27)

*   **性能优化**：`TestEngine` 引入 `Map` 数据结构，将查询复杂度从 O(N) 降低至 O(1)。
*   **代码清理**：移除冗余的 SVG 资源和未使用的 Hooks。
*   **单元测试**：集成 Vitest 测试框架，覆盖核心计分引擎逻辑，确保准确性。
*   **文件清理**：清理了 npm 缓存日志和临时文件。

## 目录结构

*   `src/data/`: 题库 (questions.json) 和性格类型数据 (types.json)
*   `src/lib/`: 核心逻辑 (TestEngine, LocalStorageManager)
*   `src/pages/`: 页面组件
*   `src/components/`: 通用组件 (Layout, Icons)
