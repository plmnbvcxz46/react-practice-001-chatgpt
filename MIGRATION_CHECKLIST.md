# OpenRouter 迁移检查清单

## ✅ 已完成的任务

### 1. 环境配置
- [x] 创建 `.env.local` 文件并配置 `OPENROUTER_API_KEY`
- [x] 更新 `.env.example` 文件
- [x] 确认 `.gitignore` 包含 `.env*` 规则

### 2. API 路由
- [x] 重写 `/app/api/chat/route.ts`
  - [x] 移除 Google Gemini SDK
  - [x] 实现 OpenRouter REST API 调用
  - [x] 实现 SSE (Server-Sent Events) 流式响应处理
  - [x] 添加完整的错误处理（包括中途错误）
  - [x] 添加 OpenRouter 特定的 headers

- [x] 创建 `/app/api/models/route.ts`
  - [x] 从 OpenRouter 获取模型列表
  - [x] 添加缓存支持（1小时）
  - [x] 过滤流行模型

### 3. 前端组件
- [x] 重写 `components/home/Main/ModelSelect.tsx`
  - [x] 从静态模型改为动态加载
  - [x] 从 `/api/models` API 获取模型列表
  - [x] 添加加载状态
  - [x] 添加错误处理
  - [x] 实现响应式布局
  - [x] 添加 tooltip 显示模型详情

### 4. 类型定义
- [x] 更新 `types/chat.ts`
  - [x] 移除 Gemini 特定类型（`GeminiPart`, `GeminiContent`）
  - [x] 添加 `OpenRouterModel` 接口

### 5. 状态管理
- [x] 更新 `reducer/AppReducer.ts`
  - [x] 将 `currentModel` 默认值从 `"g2.5flash"` 改为 `"openai/gpt-4o-mini"`

### 6. 依赖管理
- [x] 移除 `@google/genai` 包

### 7. 文档
- [x] 创建 `OPENROUTER_MIGRATION.md` - 详细的迁移说明
- [x] 创建 `QUICKSTART.md` - 快速开始指南
- [x] 更新 `README.md` - 主要文档

## 🎯 关键改进

### API 调用对比

**之前 (Google Gemini):**
```typescript
const ai = new GoogleGenAI({});
const chat = ai.chats.create({ model: "gemini-2.5-flash" });
const response = await chat.sendMessageStream({ message });
```

**现在 (OpenRouter):**
```typescript
const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "openai/gpt-4o-mini",
    messages: [...],
    stream: true,
  }),
});
```

### 流式响应处理

**之前:**
- 使用 Gemini SDK 的异步迭代器
- 简单的文本流处理

**现在:**
- 解析 SSE (Server-Sent Events) 格式
- 处理 `data:` 前缀和 `[DONE]` 标记
- 支持中途错误检测
- 更强大的错误处理

### 模型选择

**之前:**
- 硬编码 2 个模型
- 静态按钮

**现在:**
- 动态加载数百个模型
- 可配置的模型过滤
- 响应式布局
- Tooltip 显示详细信息

## 🚀 新增功能

1. **多提供商支持**：可以访问 OpenAI、Anthropic、Google、Meta 等多个提供商的模型
2. **成本优化**：OpenRouter 自动选择最经济的提供商
3. **自动故障转移**：如果一个提供商失败，自动切换到其他提供商
4. **无需代理**：直接访问，不需要配置代理服务器
5. **统一 API**：所有模型使用相同的 API 格式

## 📝 测试建议

### 基础功能测试
- [ ] 启动应用后能看到模型列表
- [ ] 可以切换不同的模型
- [ ] 发送消息后能收到流式响应
- [ ] 切换模型后对话仍然正常

### 错误处理测试
- [ ] 无效 API 密钥时显示适当错误
- [ ] 网络错误时显示适当提示
- [ ] 模型加载失败时显示错误信息

### 性能测试
- [ ] 模型列表缓存是否生效
- [ ] 流式响应是否流畅
- [ ] 多次切换模型是否流畅

## 💡 后续优化建议

1. **模型分类**：按提供商或用途对模型进行分组
2. **收藏功能**：允许用户收藏常用模型
3. **模型搜索**：添加搜索框快速查找模型
4. **成本显示**：显示每个模型的价格信息
5. **使用统计**：跟踪使用的 token 数和费用
6. **自定义过滤**：允许用户自定义显示哪些模型

## ⚠️ 注意事项

1. **API 密钥安全**：确保 `.env.local` 不被提交到版本控制
2. **费用控制**：OpenRouter 按使用量计费，注意监控费用
3. **模型可用性**：某些模型可能需要额外权限或有地区限制
4. **速率限制**：注意 API 的速率限制
