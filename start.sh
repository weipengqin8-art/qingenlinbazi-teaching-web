#!/bin/bash

# 秦根霖命理教学网页版 - 快速启动脚本

echo "🚀 正在启动秦根霖命理教学网页版..."
echo ""

# 检查是否安装了 Python
if command -v python3 &> /dev/null; then
    echo "📦 使用 Python 启动服务器..."
    python3 -m http.server 8080
elif command -v python &> /dev/null; then
    echo "📦 使用 Python 启动服务器..."
    python -m SimpleHTTPServer 8080
else
    echo "❌ 未找到 Python，请安装 Python 或直接在浏览器中打开 index.html"
    echo ""
    echo "💡 提示：你也可以直接双击 index.html 文件在浏览器中打开"
    exit 1
fi
