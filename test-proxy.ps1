# 代理连接测试脚本

Write-Host "=== 代理测试 ===" -ForegroundColor Cyan
Write-Host ""

$ports = @(7890, 7891, 10809, 1080)
$workingPort = $null

foreach ($port in $ports) {
    Write-Host "测试端口 $port..." -NoNewline
    
    $env:HTTP_PROXY = "http://127.0.0.1:$port"
    $env:HTTPS_PROXY = "http://127.0.0.1:$port"
    
    try {
        $response = Invoke-WebRequest -Uri "https://www.google.com" -Method Head -TimeoutSec 3 -UseBasicParsing -ErrorAction Stop
        Write-Host " ✓" -ForegroundColor Green
        $workingPort = $port
        break
    } catch {
        Write-Host " ✗" -ForegroundColor Red
    }
}

Write-Host ""

if ($workingPort) {
    Write-Host "✓ 代理可用 (端口 $workingPort)" -ForegroundColor Green
    
    Write-Host "`n测试 Gemini API..." -NoNewline
    try {
        $response = Invoke-WebRequest -Uri "https://generativelanguage.googleapis.com" -Method Head -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        Write-Host " ✓" -ForegroundColor Green
        Write-Host "`n环境正常！可以使用 .\start.ps1 启动" -ForegroundColor Green
    } catch {
        Write-Host " ✗" -ForegroundColor Red
        Write-Host "`nGemini API 无法访问，请检查代理节点" -ForegroundColor Yellow
    }
} else {
    Write-Host "✗ 未找到可用代理" -ForegroundColor Red
    Write-Host "请启动 Clash/V2Ray" -ForegroundColor Yellow
}

Write-Host ""
