# 故障排查指南

## "fetch failed" 错误

### 快速解决

1. **确保使用启动脚本**
   ```powershell
   .\start.ps1
   ```
   不要直接用 `npm run dev`！

2. **检查代理是否运行**
   - Clash: 端口 7890
   - V2Ray: 端口 10809 或 1080
   
3. **测试代理连接**
   ```powershell
   .\test-proxy.ps1
   ```

4. **检查 API Key**
   确保系统环境变量 `GEMINI_API_KEY` 已设置

### 常见错误

| 错误 | 原因 | 解决方案 |
|------|------|----------|
| `ECONNREFUSED` | 代理未运行 | 启动 Clash/V2Ray |
| `ETIMEDOUT` | 网络超时 | 切换代理节点 |
| `API 密钥未配置` | 环境变量未设置 | 设置 `GEMINI_API_KEY` |
| `⚠ 未检测到代理` | 启动方式错误 | 使用 `.\start.ps1` |

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
# 设置代理
$env:HTTP_PROXY = "http://127.0.0.1:7890"
$env:HTTPS_PROXY = "http://127.0.0.1:7890"

# 测试 Gemini API
Invoke-WebRequest -Uri "https://generativelanguage.googleapis.com" -Method Head
```

### 查看日志

启动后查看控制台：
- ✓ `使用代理: http://127.0.0.1:7890` - 代理配置成功
- ✓ `收到 Gemini API 响应` - API 调用成功
- ✗ `Gemini API 错误` - 出现问题，查看错误详情

### 其他解决方案

- **清除缓存**：`npm cache clean --force`
- **重装依赖**：`rm -rf node_modules && npm install`
- **更换代理节点**：在 Clash 中切换不同节点
- **检查防火墙**：确保未阻止 Node.js
