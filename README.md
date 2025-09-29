cd /Users/lizhuoran/Desktop/backend_副本
python run.py


cd /Users/lizhuoran/Desktop/backend_副本/frontend
npm run dev

# 智能投资顾问系统

一个基于人工智能的智能投资顾问平台，提供全面的资产配置、风险评估、投资策略推荐和财富管理服务。

## 📋 项目概述

本系统是一个**功能完整的综合性智能投资顾问平台**，结合机器学习、风险建模和数据可视化技术，为用户提供个性化的投资建议、资产配置方案、风险预警和财富追踪服务。

### ✅ 系统完整度
- **后端API**: 9个核心API端点，全部正常运行
- **前端界面**: 6个功能页面，完整的用户交互体验
- **数据处理**: 机器学习模型、风险评估模型、投资组合优化
- **可视化**: ECharts图表、资产配置饼图、收益曲线、风险雷达图
- **部署就绪**: Docker支持，一键部署

### 🎯 核心价值
1. **智能化配置** - 基于AI的资产配置优化
2. **个性化策略** - 定制化的投资组合方案
3. **实时监控** - 持续的资产表现追踪
4. **AI陪伴** - 24/7智能投资咨询

## ✨ 主要功能

### 🧠 核心功能模块

#### 1. 智能投资仪表盘
- **实时资产评分**: 基于多维度指标计算投资组合综合评分
- **风险评估雷达图**: 全方位展示各资产类别的风险水平
- **收益预测图表**: 基于历史数据预测未来投资收益走势
- **关键指标监控**: 实时跟踪收益率、波动率、夏普比率等核心指标

#### 2. 精准用户画像分析
- **用户画像聚类**: 使用K-Means聚类算法识别用户投资偏好类型
- **个性化投资档案**: 基于用户数据生成详细的投资风险画像报告
- **风险分层管理**: 将用户分为不同风险等级进行精准投资建议

#### 3. 投资未来洞察
- **收益预测**: 基于XGBoost和神经网络的投资收益预测
- **情景模拟**: 支持不同市场条件下的投资组合表现模拟
- **长期规划**: 提供5-10年的投资发展预测和退休规划

#### 4. 智能投资行动方案
- **个性化推荐**: 基于用户画像生成定制化投资策略
- **执行跟踪**: 实时监控投资策略的执行进度
- **效果评估**: 量化评估投资策略的有效性和风险调整收益

#### 5. AI投资助手
- **自然语言交互**: 支持中文自然语言对话
- **意图识别**: 智能识别用户投资咨询意图
- **情感分析**: 分析用户投资情绪并提供相应支持
- **智能推荐**: 基于对话内容提供相关投资建议

#### 6. 投资成果评估
- **策略效果分析**: 量化展示投资策略的效果
- **收益改善追踪**: 长期跟踪用户投资组合的表现变化
- **ROI分析**: 评估投资策略的回报率和风险调整收益

### 🤖 人工智能算法

- **机器学习预测**: XGBoost回归模型和神经网络收益预测算法
- **聚类分析**: K-Means用户分群和投资偏好识别
- **自然语言处理**: 基于jieba分词和TF-IDF的文本分析
- **风险评估**: 多因子风险评估模型
- **投资组合优化**: 基于现代投资组合理论的资产配置优化

## 🛠️ 技术栈

### 后端技术栈
- **框架**: Flask 3.0+ (Python Web框架)
- **机器学习**: scikit-learn 1.3+, XGBoost 2.0+
- **数据处理**: pandas 2.0+, numpy 1.26+
- **自然语言处理**: jieba分词
- **数据可视化**: matplotlib 3.8+
- **API设计**: RESTful API架构

### 前端技术栈
- **框架**: React 18.3+ (TypeScript)
- **UI组件**: Ant Design 5.20+
- **数据可视化**: ECharts 5.5+
- **构建工具**: Vite 5.4+
- **状态管理**: React Hooks
- **HTTP客户端**: Axios 1.7+

### 部署技术栈
- **容器化**: Docker & Docker Compose
- **反向代理**: Nginx (可选)
- **数据库**: SQLite (开发环境) / PostgreSQL (生产环境)
- **缓存**: Redis (可选)

## 🚀 快速开始

### 系统状态检查
```bash
# 检查后端服务状态
curl http://localhost:8006/api/dashboard/1

# 检查前端服务状态
curl http://localhost:5173/
```
- **智能推荐**: 基于对话内容提供相关健康建议

#### 6. 脑健康成果评估
- **干预效果分析**: 量化展示干预措施的效果
- **健康改善追踪**: 长期跟踪用户健康指标的变化
- **ROI分析**: 评估健康投资的回报率

### 🤖 人工智能算法

- **机器学习预测**: XGBoost回归模型和神经网络预测算法
- **聚类分析**: K-Means用户分群和健康亚型识别
- **自然语言处理**: 基于jieba分词和TF-IDF的文本分析
- **风险评估**: 多因子风险评估模型
- **知识推理**: 基于规则的健康知识推理引擎

## 🛠️ 技术栈

### 后端技术栈
- **框架**: Flask 3.0+ (Python Web框架)
- **机器学习**: scikit-learn 1.3+, XGBoost 2.0+
- **数据处理**: pandas 2.0+, numpy 1.26+
- **自然语言处理**: jieba分词
- **数据可视化**: matplotlib 3.8+
- **API设计**: RESTful API架构

### 前端技术栈
- **框架**: React 18.3+ (TypeScript)
- **UI组件**: Ant Design 5.20+
- **数据可视化**: ECharts 5.5+
- **构建工具**: Vite 5.4+
- **状态管理**: React Hooks
- **HTTP客户端**: Axios 1.7+

### 部署技术栈
- **容器化**: Docker & Docker Compose
- **反向代理**: Nginx (可选)
- **数据库**: SQLite (开发环境) / PostgreSQL (生产环境)
- **缓存**: Redis (可选)

## 🚀 快速开始

### 系统状态检查
```bash
# 检查后端服务状态
curl http://localhost:8006/api/dashboard/1

# 检查前端服务状态
curl http://localhost:5173/
```

### 启动方式

### 环境要求
- Python 3.8+
- Node.js 16+
- Docker & Docker Compose (推荐)

### 方法一：Docker一键部署 (推荐)

1. **克隆项目**
```bash
git clone <repository-url>
cd smart-investment-advisor
```

2. **使用部署脚本**
```bash
chmod +x deploy.sh
./deploy.sh
```

3. **访问应用**
- 前端: http://localhost:5173
- 后端API: http://localhost:8006

### 方法二：手动部署

#### 后端部署
```bash
# 1. 安装Python依赖
pip install -r requirements.txt

# 2. 启动后端服务
python run.py
```

#### 前端部署
```bash
# 1. 进入前端目录
cd frontend

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 构建生产版本 (可选)
npm run build
npm run preview
```

### 方法三：Docker Compose部署
```bash
# 构建并启动服务
docker-compose up --build

# 后台运行
docker-compose up -d --build
```

## 📖 使用指南

### 用户操作流程

1. **注册/登录**: 系统支持多用户管理
2. **数据录入**: 上传或手动输入财务和投资偏好数据
3. **投资评估**: 查看智能仪表盘和风险评估结果
4. **个性化方案**: 获取定制化的投资组合建议
5. **AI咨询**: 与AI助手进行投资咨询
6. **进度跟踪**: 监控投资策略的执行效果

### API接口文档

#### 主要API端点

##### 1. 📊 仪表盘API
- `GET /api/dashboard/{user_id}` - 获取用户投资仪表盘数据
  - 返回：投资组合评分、雷达图数据、风险评估、收益预测、核心指标等

##### 2. 🤖 AI助手API
- `POST /api/assistant/chat` - AI助手对话接口
  - 参数：`{"message": "用户消息", "user_id": 1}`
  - 返回：意图识别、情感分析、AI回复
- `GET /api/assistant/history/{user_id}` - 获取聊天历史
  - 返回：历史对话记录

##### 3. 🔮 未来洞察API
- `GET /api/future-insights/{user_id}` - 获取投资未来洞察
  - 返回：收益预测曲线、基准数据、投资建议
- `POST /api/future-insights/{user_id}/simulate` - 情景模拟
  - 参数：自定义投资参数
  - 返回：模拟结果数据

##### 4. 💡 个性化推荐API
- `GET /api/recommendation/{user_id}` - 获取个性化投资推荐
  - 返回：资产配置建议、投资策略
- `GET /api/recommendation/progress/{user_id}` - 获取推荐进度
  - 返回：策略执行状态
- `PUT /api/recommendation/progress/{user_id}/{task_id}` - 更新策略进度
  - 参数：策略执行状态

##### 5. 🧠 投资知识库API
- `GET /api/knowledge/asset-class/{asset_type}` - 获取资产类别信息
  - 返回：指定资产类别详细信息
- `GET /api/knowledge/search?q={query}` - 投资知识库搜索
  - 返回：相关实体、关系、投资建议
- `GET /api/knowledge/recommendations/{user_id}` - 获取投资知识推荐
  - 返回：基于用户画像的投资知识推荐

#### API使用示例

```bash
# 获取仪表盘数据
curl http://localhost:8006/api/dashboard/1

# AI助手对话
curl -X POST http://localhost:8006/api/assistant/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "我想了解股票投资", "user_id": 1}'

# 获取聊天历史
curl http://localhost:8006/api/assistant/history/1

# 获取未来洞察
curl http://localhost:8006/api/future-insights/1

# 获取个性化推荐
curl http://localhost:8006/api/recommendation/1

# 投资知识搜索
curl "http://localhost:8006/api/knowledge/search?q=股票"

# 获取资产类别信息
curl http://localhost:8006/api/knowledge/asset-class/股票
```

#### API响应示例

##### 仪表盘数据响应
```json
{
  "investmentScore": 78,
  "userProfile": "稳健成长型",
  "radarData": {
    "categories": ["收益能力", "风险控制", "流动性", "分散度", "长期规划"],
    "values": [75, 82, 70, 85, 78]
  },
  "riskAssessment": {
    "risk_level": "moderate",
    "risk_score": 0.035,
    "confidence": 0.88
  },
  "keyMetrics": [
    {"name": "年化收益率", "value": 8.45, "status": "good", "unit": "%"},
    {"name": "最大回撤", "value": -12.3, "status": "warning", "unit": "%"},
    {"name": "夏普比率", "value": 1.85, "status": "good", "unit": ""},
    {"name": "资产总值", "value": "2,456,789", "status": "good", "unit": "元"}
  ]
}
```

##### AI助手对话响应
```json
{
  "intent": {
    "intent": "investment_advice",
    "confidence": 0.89
  },
  "sentiment": {
    "sentiment": "curious",
    "score": 0.7
  },
  "response": "关于股票投资，我建议您...",
  "tags": [
    {"text": "股票投资", "value": 95},
    {"text": "风险控制", "value": 78}
  ]
}
```

## 🧪 测试

### 运行单元测试
```bash
# 后端测试
python -m pytest tests/ -v

# 前端测试 (如果配置了)
npm test
```

### 数据说明
- **pension_mock_500.csv**: 包含模拟用户投资和财务数据
- **测试用户ID**: U000001-U000500 (模拟用户)
- **指标字段**: age, gender, income, assets, liabilities, risk_preference等

## 📁 项目结构

```
smart-investment-advisor/
├── app/                          # 后端应用
│   ├── __init__.py              # Flask应用工厂
│   ├── api/                     # API蓝图
│   │   ├── dashboard.py         # 仪表盘API
│   │   ├── assistant.py         # AI助手API
│   │   ├── future.py            # 未来洞察API
│   │   ├── recommendation.py    # 推荐API
│   │   └── knowledge.py         # 投资知识库API
│   └── services/                # 业务逻辑服务
│       ├── analysis_service.py  # 投资分析服务
│       ├── nlp_service.py       # NLP服务
│       ├── prediction_service.py # 收益预测服务
│       └── ...
├── frontend/                    # 前端应用
│   ├── src/
│   │   ├── App.tsx              # 主应用组件
│   │   ├── pages/               # 页面组件
│   │   │   ├── Dashboard.tsx    # 仪表盘页面
│   │   │   ├── Assistant.tsx    # AI助手页面
│   │   │   └── ...
│   │   └── styles.css           # 样式文件
│   ├── package.json             # 前端依赖
│   └── vite.config.ts           # Vite配置
├── data/                        # 数据文件
│   ├── pension_mock_500.csv     # 投资模拟数据
│   └── mock_data.csv            # 兼容性数据
├── tests/                       # 测试文件
├── requirements.txt             # Python依赖
├── docker-compose.yml           # Docker编排
├── Dockerfile                   # Docker镜像
├── deploy.sh                    # 部署脚本
└── README.md                    # 项目文档
```

## 🔧 配置说明

### 环境变量
```bash
# Flask配置
FLASK_ENV=development/production
PYTHONPATH=/app

# 前端配置
NODE_ENV=development/production
```

### 数据库配置
系统默认使用SQLite进行数据存储，如需使用其他数据库，请修改相应服务文件。

## 🧪 快速测试

### 一键测试所有API
```bash
# 创建测试脚本
cat > test_api.sh << 'EOF'
#!/bin/bash
echo "🧪 测试智能投资顾问系统API"

# 测试仪表盘
echo "📊 测试仪表盘API..."
curl -s http://localhost:8006/api/dashboard/1 | jq '.investmentScore' && echo " ✅"

# 测试AI助手
echo "🤖 测试AI助手API..."
curl -s -X POST http://localhost:8006/api/assistant/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "我想了解投资组合配置", "user_id": 1}' | jq '.response' && echo " ✅"

# 测试未来洞察
echo "🔮 测试未来洞察API..."
curl -s http://localhost:8006/api/future-insights/1 | jq '.baselineCurve[0]' && echo " ✅"

# 测试推荐系统
echo "💡 测试推荐API..."
curl -s http://localhost:8006/api/recommendation/1 | jq '.recommendations.asset_allocation[0].asset' && echo " ✅"

echo "🎉 所有API测试完成！"
EOF

chmod +x test_api.sh
./test_api.sh
```

### 浏览器访问测试
- **前端界面**: http://localhost:5173/
- **后端健康检查**: http://localhost:8006/api/dashboard/1

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

- 项目维护者: [您的姓名]
- 邮箱: [您的邮箱]
- 项目主页: [项目地址]

## 🙏 致谢

- 感谢所有贡献者的辛勤工作
- 感谢开源社区提供的技术支持
- 特别感谢金融专家提供的专业指导

---

**注意**: 本系统仅用于投资咨询辅助，不构成投资决策建议。如有投资需求，请咨询专业金融机构。

```bash
./deploy.sh
```

脚本会自动安装依赖并启动前后端服务。

### 手动部署

#### 后端
```bash
cd /Users/lizhuoran/Desktop/backend
pip install -r requirements.txt
python run.py
```

#### 前端
```bash
cd frontend
npm install
npm run dev
```

### Docker 部署（需要安装 Docker）

```bash
docker-compose up --build
```

## 访问地址

- 前端应用: http://localhost:5173
- 后端 API: http://localhost:8006

## API 接口

### 主要端点
- `GET /api/dashboard/<user_id>`: 获取用户投资仪表盘数据
- `GET /api/future/<user_id>`: 获取投资收益预测
- `POST /api/recommendation/<user_id>`: 获取个性化投资推荐
- `POST /api/assistant/chat`: AI 投资助手对话
- `GET /api/knowledge/assets`: 获取投资知识图谱

## 项目结构

```
smart-investment-advisor/
├── app/                    # Flask 应用
│   ├── api/               # API 蓝图
│   └── services/          # 业务逻辑服务
├── frontend/              # React 前端
│   ├── src/
│   │   ├── pages/        # 页面组件
│   │   └── ...
├── data/                  # 数据文件
├── Dockerfile            # 后端容器配置
├── docker-compose.yml    # 多服务编排
└── requirements.txt      # Python 依赖
```

## 测试

运行测试套件：
```bash
python -m pytest tests/ -v --cov=app
```

## 部署说明

### 生产环境部署
1. 配置环境变量
2. 构建 Docker 镜像
3. 使用 Docker Compose 启动服务
4. 配置反向代理 (nginx)

### 监控和维护
- 健康检查端点：`/health`
- 日志文件位置：`/app/logs/`
- 数据备份：定期备份 `data/` 目录

## 许可证

MIT License