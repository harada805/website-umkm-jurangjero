@echo off
setlocal
cd /d "%~dp0"

echo.
echo Jurang Jero Digital - Development Server
echo ----------------------------------------
echo Membuka website di http://localhost:3000
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

call npm.cmd run dev -- -p 3000

echo.
echo Server berhenti.
pause
