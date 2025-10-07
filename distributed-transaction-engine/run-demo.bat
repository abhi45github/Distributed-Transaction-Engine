@echo off
echo.
echo =========================================================
echo    DISTRIBUTED TRANSACTION ENGINE - QUICK DEMO
echo =========================================================
echo.
echo Starting demo application...
echo.

REM Check if Java is available
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java 17 or higher
    pause
    exit /b 1
)

REM Compile if needed
if not exist TransactionDemo.class (
    echo Compiling demo application...
    javac TransactionDemo.java
    if %errorlevel% neq 0 (
        echo ERROR: Compilation failed
        pause
        exit /b 1
    )
)

REM Run the demo
java TransactionDemo

echo.
echo =========================================================
echo Demo completed successfully!
echo.
echo To run again: run-demo.bat
echo To test with Docker: docker-compose up -d
echo.
echo GitHub: https://github.com/abhi45github/Distributed-Transaction-Engine
echo =========================================================
pause