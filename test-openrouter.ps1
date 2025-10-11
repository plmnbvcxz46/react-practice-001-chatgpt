# OpenRouter API 测试脚本

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "OpenRouter API 配置测试" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 .env.local 文件
Write-Host "[1/4] 检查环境变量文件..." -ForegroundColor Yellow

$envExists = Test-Path ".env.local"
if ($envExists) {
    Write-Host "  ✓ .env.local 文件存在" -ForegroundColor Green
    
    $envContent = Get-Content ".env.local" -Raw
    
    if ($envContent -match "OPENROUTER_API_KEY=sk-or-v1-") {
        Write-Host "  ✓ OPENROUTER_API_KEY 已配置" -ForegroundColor Green
    }
    else {
        Write-Host "  ✗ OPENROUTER_API_KEY 未配置或格式不正确" -ForegroundColor Red
        Write-Host "    请在 .env.local 中设置正确的 API 密钥" -ForegroundColor Yellow
    }
}
else {
    Write-Host "  ✗ .env.local 文件不存在" -ForegroundColor Red
    Write-Host "    请从 .env.example 复制并配置" -ForegroundColor Yellow
}

Write-Host ""

# 检查依赖
Write-Host "[2/4] 检查项目依赖..." -ForegroundColor Yellow

$nodeModulesExists = Test-Path "node_modules"
if ($nodeModulesExists) {
    Write-Host "  ✓ node_modules 存在" -ForegroundColor Green
    
    $geminiExists = Test-Path "node_modules/@google/genai"
    if ($geminiExists) {
        Write-Host "  ⚠ 检测到旧的 @google/genai 依赖" -ForegroundColor Yellow
        Write-Host "    建议运行: npm uninstall @google/genai" -ForegroundColor Yellow
    }
    else {
        Write-Host "  ✓ 已移除 @google/genai 依赖" -ForegroundColor Green
    }
}
else {
    Write-Host "  ✗ node_modules 不存在" -ForegroundColor Red
    Write-Host "    请运行: npm install" -ForegroundColor Yellow
}

Write-Host ""

# 检查关键文件
Write-Host "[3/4] 检查关键文件..." -ForegroundColor Yellow

$files = @(
    "app/api/chat/route.ts",
    "app/api/models/route.ts",
    "components/home/Main/ModelSlect.tsx",
    "types/chat.ts"
)

foreach ($file in $files) {
    $fileExists = Test-Path $file
    if ($fileExists) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    }
    else {
        Write-Host "  ✗ $file 缺失" -ForegroundColor Red
    }
}

Write-Host ""

# 测试 OpenRouter API 连接
Write-Host "[4/4] 测试 OpenRouter API 连接..." -ForegroundColor Yellow

$canTestAPI = $false
$apiKey = ""

if ($envExists) {
    $envContent = Get-Content ".env.local" -Raw
    if ($envContent -match 'OPENROUTER_API_KEY=(.+)') {
        $apiKey = $matches[1].Trim()
        
        if ($apiKey -and $apiKey -ne "your_openrouter_api_key_here") {
            $canTestAPI = $true
        }
    }
}

if ($canTestAPI) {
    try {
        Write-Host "  正在测试 API 连接..." -ForegroundColor Gray
        
        $headers = @{
            "Authorization" = "Bearer $apiKey"
            "Content-Type"  = "application/json"
        }
        
        $response = Invoke-WebRequest -Uri "https://openrouter.ai/api/v1/models" -Headers $headers -Method GET -TimeoutSec 10
        
        if ($response.StatusCode -eq 200) {
            $data = $response.Content | ConvertFrom-Json
            $modelCount = $data.data.Count
            Write-Host "  ✓ API 连接成功！可用模型数: $modelCount" -ForegroundColor Green
        }
        else {
            Write-Host "  ✗ API 返回错误状态码: $($response.StatusCode)" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "  ✗ API 连接失败: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "    请检查网络连接和 API 密钥" -ForegroundColor Yellow
    }
}
else {
    Write-Host "  ⊘ 跳过（API 密钥未配置）" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "测试完成！" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "下一步：" -ForegroundColor Yellow
Write-Host "  1. 如果环境变量未配置，请编辑 .env.local" -ForegroundColor White
Write-Host "  2. 如果依赖未安装，请运行 npm install" -ForegroundColor White
Write-Host "  3. 启动开发服务器：npm run dev" -ForegroundColor White
Write-Host "  4. 访问：http://localhost:3000" -ForegroundColor White
Write-Host ""
