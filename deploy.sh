#!/bin/bash

# 智能投资顾问系统部署脚本

echo "🚀 开始部署智能投资顾问系统..."

# 检查Python环境
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 未安装，请先安装 Python3"
    exit 1
fi

# 检查Node.js环境
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

# 安装后端依赖
echo "📦 安装后端依赖..."
pip3 install -r requirements.txt

# 安装前端依赖
echo "📦 安装前端依赖..."
cd frontend
npm install
cd ..

# 启动后端服务
echo "🔧 启动后端服务..."
python3 run.py &
BACKEND_PID=$!

# 等待后端启动
sleep 5

# 启动前端服务
echo "🎨 启动前端服务..."
cd frontend
npm run dev &
FRONTEND_PID=$!

cd ..

echo "✅ 部署完成！"
echo "🌐 前端访问地址: http://localhost:5173"
echo "🔗 后端API地址: http://localhost:8006"
echo ""
echo "按 Ctrl+C 停止服务"

# 等待用户中断
trap "echo '🛑 停止服务...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait