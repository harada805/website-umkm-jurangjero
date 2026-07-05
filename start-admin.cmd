@echo off
setlocal
cd /d "%~dp0"

echo.
echo Jurang Jero Digital - Admin Login
echo ---------------------------------
echo Server: http://localhost:3000
echo Admin : http://localhost:3000/admin/login
echo.

if not exist node_modules (
  echo node_modules belum ada. Menjalankan npm install dulu...
  call npm.cmd install
  if errorlevel 1 (
    echo.
    echo Gagal install dependency. Pastikan Node.js dan koneksi internet aktif.
    pause
    exit /b 1
  )
)

start "" powershell.exe -NoProfile -Command "$url='http://localhost:3000/admin/login'; for ($i=0; $i -lt 60; $i++) { try { $r=Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2; if ($r.StatusCode -eq 200) { Start-Process $url; exit } } catch { Start-Sleep -Seconds 1 } }; Start-Process $url"
call npm.cmd run dev -- -p 3000

echo.
echo Server berhenti.
pause
