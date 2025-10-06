# 简单启动脚本
# 设置代理并启动开发服务器

Write-Host "=== 启动开发服务器 ===" -ForegroundColor Cyan

# 设置代理（使用端口 7890）
$env:HTTP_PROXY = "http://127.0.0.1:7890"
$env:HTTPS_PROXY = "http://127.0.0.1:7890"

Write-Host "已设置代理: http://127.0.0.1:7890" -ForegroundColor Green
Write-Host ""

# 启动
npm run dev
