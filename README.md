# react网页练习

参照教程 [知行小课](https://x.zhixing.co/courses/react-hands-on-tutorial-for-beginners/)

使用 Next.js 和 OpenRouter API 构建的 AI 聊天网站练习

## 🎉 重大更新：已迁移到 OpenRouter

本项目已从 Google Gemini API 迁移到 **OpenRouter**，支持访问数百个 AI 模型！

### 快速开始

1. **配置环境变量**

创建 `.env.local` 文件：

```bash
OPENROUTER_API_KEY=your_api_key_here
OPENROUTER_SITE_URL=http://localhost:3000
OPENROUTER_SITE_NAME=ChatGPT Clone
```

2. **启动应用**

```powershell
npm install
npm run dev
```

3. **访问应用**

打开浏览器访问 http://localhost:3000

> 📖 详细设置指南请查看 [QUICKSTART.md](./QUICKSTART.md)
> 
> 📋 迁移详情请查看 [OPENROUTER_MIGRATION.md](./OPENROUTER_MIGRATION.md)

## 前置条件

- **API Key**：从 [OpenRouter](https://openrouter.ai/keys) 获取（**不再需要代理！**）
- **Node.js**：18.x+

## 技术栈

- Next.js 15 + TypeScript
- Tailwind CSS（支持黑夜模式）
- Prisma + SQLite
- **OpenRouter API** - 统一访问 GPT-4、Claude、Gemini、Llama 等数百个模型
- React Markdown + 语法高亮

## 主要特性

✅ **多模型支持**：动态加载可用模型，一键切换
✅ **流式响应**：实时显示 AI 回复
✅ **完整聊天历史**：基于 Prisma + SQLite
✅ **黑夜模式**：自动适配系统主题
✅ **Markdown 渲染**：支持代码高亮、表格等

## 常用命令

```powershell
npm run dev           # 启动开发服务器
npm install           # 安装依赖
npx prisma studio     # 查看数据库
npm run build         # 构建生产版本
```

## 支持的模型示例

- OpenAI GPT-4o / GPT-4o Mini
- Anthropic Claude 3.5 Sonnet / Opus
- Google Gemini 2.5 Pro / Flash
- Meta Llama 3.3 70B
- Mistral Large
- 等等...

## 学习笔记

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

## 相关链接

- [OpenRouter 官网](https://openrouter.ai/)
- [OpenRouter API 文档](https://openrouter.ai/docs)
- [OpenRouter 模型列表](https://openrouter.ai/models)
- [Next.js 文档](https://nextjs.org/docs)
- [Prisma 文档](https://www.prisma.io/docs)
- [React Markdown](https://github.com/remarkjs/react-markdown)
