Write-Host "=============================================" -ForegroundColor Green
Write-Host "   Samyak Publisher Desktop Build Script     " -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""

# 1. Install Node.js dependencies
Write-Host "[1/3] Installing packages (npm install)..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: npm install failed!" -ForegroundColor Red
    Exit $LASTEXITCODE
}

# 2. Build production assets
Write-Host "[2/3] Building production assets (npm run build:prod)..." -ForegroundColor Yellow
npm run build:prod
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Production build failed!" -ForegroundColor Red
    Exit $LASTEXITCODE
}

# 3. Package into Windows .exe installer
Write-Host "[3/3] Packaging into Windows .exe installer (npm run electron:dist)..." -ForegroundColor Yellow
npm run electron:dist
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Packaging failed!" -ForegroundColor Red
    Exit $LASTEXITCODE
}

Write-Host ""
Write-Host "=============================================" -ForegroundColor Green
Write-Host "  Success! Your .exe installer is ready in:  " -ForegroundColor Green
Write-Host "  samyakdead- new\dist-desktop\              " -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Green
