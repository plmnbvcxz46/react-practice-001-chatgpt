# OpenRouter 迁移说明

## 概述

本项目已从 Google Gemini API 迁移到 OpenRouter API。OpenRouter 提供了一个统一的接口来访问数百个 AI 模型。

## 主要变更

### 1. 环境变量配置

创建 `.env.local` 文件（已从 `.env.example` 复制）：

```bash
OPENROUTER_API_KEY=your_api_key_here
OPENROUTER_SITE_URL=http://localhost:3000
OPENROUTER_SITE_NAME=ChatGPT Clone
```

### 2. API 路由变更

#### `/app/api/chat/route.ts`
- ✅ 替换 Google Gemini SDK 为 OpenRouter REST API
- ✅ 使用标准的 OpenAI 兼容格式
- ✅ 实现完整的流式响应处理
- ✅ 添加错误处理（包括中途错误）
- ✅ 支持 SSE (Server-Sent Events) 格式

#### `/app/api/models/route.ts` (新增)
- ✅ 从 OpenRouter 获取可用模型列表
- ✅ 包含模型过滤（显示流行模型）
- ✅ 支持缓存（1小时）

### 3. 前端组件变更

#### `ModelSelect.tsx`
- ✅ 从静态模型列表改为动态加载
- ✅ 从 `/api/models` 获取模型列表
- ✅ 显示加载状态和错误处理
- ✅ 支持显示模型详细信息（tooltip）
- ✅ 响应式布局，支持多个模型

### 4. 类型定义更新

#### `types/chat.ts`
- ✅ 移除 Gemini 特定类型
- ✅ 添加 `OpenRouterModel` 接口

## OpenRouter API 特性

### 流式输出格式

OpenRouter 使用 Server-Sent Events (SSE) 格式：

```
data: {"id":"...","choices":[{"delta":{"content":"text"}}]}
data: [DONE]
```

### 支持的模型示例

- `openai/gpt-4o` - GPT-4 Omni
- `openai/gpt-4o-mini` - GPT-4 Omni Mini
- `anthropic/claude-3.5-sonnet` - Claude 3.5 Sonnet
- `google/gemini-2.5-pro` - Gemini 2.5 Pro
- `google/gemini-2.5-flash` - Gemini 2.5 Flash
- `meta-llama/llama-3.3-70b-instruct` - Llama 3.3 70B
- 等等...

## 启动应用

1. 安装依赖（如果还没有安装）：
```bash
npm install
```

2. 确保 `.env.local` 文件已配置正确的 API 密钥

3. 启动开发服务器：
```bash
npm run dev
```

4. 访问 http://localhost:3000

## 注意事项

1. **API 密钥安全**：`.env.local` 文件已添加到 `.gitignore`，不会被提交到版本控制
2. **模型选择**：应用会自动加载可用模型，默认选择第一个
3. **错误处理**：实现了完整的错误处理，包括流式响应中途错误
4. **缓存**：模型列表缓存 1 小时，减少 API 调用

## 依赖变更

- ❌ 移除：`@google/genai` (不再需要)
- ✅ 保留：所有其他依赖保持不变

可选：如果想完全清理，可以运行：
```bash
npm uninstall @google/genai
```

## API 文档

更多信息请访问：
- OpenRouter 官方文档：https://openrouter.ai/docs
- 模型列表：https://openrouter.ai/models
- API 参考：https://openrouter.ai/docs/api-reference
