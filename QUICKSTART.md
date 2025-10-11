# 快速开始 - OpenRouter 配置

## 1. 获取 API 密钥

1. 访问 [OpenRouter](https://openrouter.ai/)
2. 注册/登录账户
3. 前往 [API Keys](https://openrouter.ai/keys) 页面
4. 创建新的 API 密钥

## 2. 配置环境变量

复制并重命名环境变量文件：

```bash
# Windows PowerShell
Copy-Item .env.example .env.local

# 或者手动创建 .env.local 文件
```

然后编辑 `.env.local`，填入你的 API 密钥：

```env
OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
OPENROUTER_SITE_URL=http://localhost:3000
OPENROUTER_SITE_NAME=ChatGPT Clone
```

## 3. 安装依赖

```bash
npm install
```

## 4. （可选）移除旧的 Gemini 依赖

```bash
npm uninstall @google/genai
```

## 5. 启动应用

```bash
npm run dev
```

## 6. 访问应用

打开浏览器访问：http://localhost:3000

## 特性说明

✅ **动态模型选择**：应用会自动从 OpenRouter 获取可用模型列表
✅ **流式响应**：支持实时流式输出
✅ **多模型支持**：可以访问 GPT-4、Claude、Gemini、Llama 等数百个模型
✅ **错误处理**：完善的错误处理机制

## 故障排除

### 问题：无法加载模型列表

检查：
1. `.env.local` 文件是否存在且配置正确
2. API 密钥是否有效
3. 网络连接是否正常

### 问题：流式响应不工作

检查：
1. 浏览器控制台是否有错误
2. 网络请求是否成功（F12 查看 Network）
3. API 密钥是否有足够的额度

### 问题：模型显示异常

这是正常的，OpenRouter 会根据可用性和你的权限返回不同的模型列表。

## 更多帮助

- [OpenRouter 文档](https://openrouter.ai/docs)
- [OpenRouter Discord](https://openrouter.ai/discord)
- [查看完整迁移说明](./OPENROUTER_MIGRATION.md)
