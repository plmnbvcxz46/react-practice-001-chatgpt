# 故障排查指南

## "fetch failed" 错误

### 快速解决

1. **使用启动脚本**
   ```powershell
   .\start.ps1
   ```

2. **检查 API Key**
   确保系统环境变量 `GEMINI_API_KEY` 已设置

3. **检查网络连接**
   确保能够访问 Google API 服务

### 常见错误

| 错误 | 原因 | 解决方案 |
|------|------|----------|
| `ECONNREFUSED` | 网络连接被拒绝 | 检查网络设置 |
| `ETIMEDOUT` | 网络超时 | 检查网络连接 |
| `API 密钥未配置` | 环境变量未设置 | 设置 `GEMINI_API_KEY` |
| `Unauthorized` | API Key 无效 | 检查 API Key 是否正确 |

### 设置环境变量

**临时设置（当前会话）：**
```powershell
$env:GEMINI_API_KEY = "your-api-key"
```

**永久设置：**
1. 右键"此电脑" → 属性 → 高级系统设置
2. 环境变量 → 新建
3. 变量名：`GEMINI_API_KEY`，变量值：你的 API Key

### 手动测试连接

```powershell
# 测试 Gemini API 连接
Invoke-WebRequest -Uri "https://generativelanguage.googleapis.com" -Method Head
```

### 查看日志

启动后查看控制台：
- ✓ `收到 Gemini API 响应` - API 调用成功
- ✗ `Gemini API 错误` - 出现问题，查看错误详情

### 其他解决方案

- **清除缓存**：`npm cache clean --force`
- **重装依赖**：`rm -rf node_modules && npm install`
- **检查防火墙**：确保未阻止 Node.js
- **检查 DNS**：确保能解析 Google 域名
