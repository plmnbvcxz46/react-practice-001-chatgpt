# ChatGPT Clone - Gemini API 版本

使用 Next.js 和 Google Gemini API 构建的 ChatGPT 克隆项目。

##快速启动

** 重要：必须使用启动脚本（自动配置代理）**

```powershell
.\start.ps1
```

> 不要直接使用 `npm run dev`，会导致代理未配置而无法访问 Gemini API！

## 前置条件

- **代理软件**：Clash/V2Ray 运行在端口 7890
- **API Key**：系统环境变量 `GEMINI_API_KEY`
- **Node.js**：18.x+

## 技术栈

- Next.js 15 + TypeScript
- Tailwind CSS（支持黑夜模式）
- Prisma + SQLite
- Google Gemini API (2.5 Flash / Pro)
- React Markdown + 语法高亮

##常用命令

```powershell
.\start.ps1           # 启动开发服务器
.\test-proxy.ps1      # 测试代理连接
npm install           # 安装依赖
npx prisma studio     # 查看数据库
```

## 遇到问题？

如果出现 `fetch failed` 错误，查看 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

##学习笔记

### 需要精进的点

- **React Hooks** - useState, useEffect, useContext 等
- **Tailwind 黑夜模式** - 官网有更新，需要重新学习
- **TypeScript type** - 类型别名，类似接口/抽象类
- **Markdown 渲染** - [react-markdown](https://github.com/remarkjs/react-markdown) 用法和插件
- **Stream API** - 数据流和异步实现（Promise）
- **TypeScript enum** - 枚举类型
- **Fetch API** - Response 对象和 fetch 方法
- **Prisma** - 数据库 ORM 框架（已切换到 SQLite）
- **事件发布订阅** - EventBus 模式（重要但还没完全理解）

##相关链接

- [Google Gemini API](https://ai.google.dev/)
- [Next.js 文档](https://nextjs.org/docs)
- [Prisma 文档](https://www.prisma.io/docs)
- [React Markdown](https://github.com/remarkjs/react-markdown)
