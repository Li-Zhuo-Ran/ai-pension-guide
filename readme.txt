文件夹名称：项目根目录
文件夹类型：项目总览

一、文件夹作用
本目录为项目的总体根目录，包含项目的完整结构、关键配置文件、运行入口、数据文件以及部署脚本。
项目名称：ai-pension-guide(智能养老规划)
主要功能：一个基于大语言模型的智能投资顾问平台，结合机器学习、风险建模和数据可视化技术，为用户提供个性化和动态化的投资建议、资产配置方案、风险预警和财富追踪服务。

二、主要文件与文件夹说明
1. app/ 
 后端核心源码目录，包含接口层（api）、服务层（services）以及应用初始化文件（__init__.py）。 
 主要负责数据处理、业务逻辑、API 提供与模型调用等功能。
2. fronted/ 
 前端展示界面源码目录，基于Vite + Vue/React 技术栈实现。
3. data/ 
 数据文件与实验数据集存放目录，用于支撑系统后台分析模块和模型验证。
4. tests/ 
 单元测试与集成测试目录
 包含用于验证后端 API、数据处理逻辑正确性的测试脚本。
 测试框架：pytest (配置文件pytest.ini位于根目录)
5. Dockerfile / docker-compose.yml 
 项目容器化部署文件。  
 Dockerfile：定义后端运行环境。  
 docker-compose.yml：协调后端与前端服务的多容器编排运行。
6. deploy.sh 
 项目自动化部署脚本，包含一键构建、启动与更新命令。
7. requirements.txt /requirements-test.txt
 Python 运行依赖清单与测试依赖清单。
8. run.py 
 后端运行入口文件，直接启动后端服务。
9. readme.md
 项目简要说明文档（markdown版本）
10. readme.txt
 当前文件，用于项目根目录说明

三、运行说明
1. 环境要求
 Python 3.8+
 Node.js 16+
 Docker & Docker Compose (推荐)
2. 快速开始
方法一：Docker部署
(1)克隆项目
    git clone https://github.com/Li-Zhuo-Ran/ai-pension-guide.git
    cd ai-pension-guide-main
(2)使用部署脚本
    chmod +x deploy.sh
    ./deploy.sh
(3)访问方式
    前端：http://localhost:5173
    后端：http://localhost:8006
方法二：手动部署
 后端部署：
(1)安装依赖
    pip install -r requirements.txt
(2)启动后端服务
    python run.py
 前端部署：
(1)进入前端目录
    cd fronted 
(2)安装依赖
    npm install
(3)启动开发服务器
    npm run dev
方法三：Docker Compose部署
(1)构建并启动服务
    docker-compose up --build
(2)后台运行
    docker-compose up -d --build

四、主要技术栈说明
本项目采用前后端分离框架，整体技术栈如下：
【后端技术栈】
- 框架: Flask 3.0+ (Python Web框架)
- 数据分析与建模: scikit-learn 1.3+, XGBoost 2.0+
- 数据处理: pandas 2.0+, numpy 1.26+
- 自然语言处理: jieba分词
- 数据可视化: matplotlib 3.8+
- API设计: RESTful API架构
【前端技术栈】
- 框架：React 18.3+（TypeScript）
- UI 组件：Ant Design 5.20+
- 数据可视化：ECharts 5.5+
- 构建工具：Vite 5.4+
- 状态管理：React Hooks
- 网络请求：Axios 1.7+
【部署与运行环境】
- 容器化：Docker + Docker Compose
- 反向代理：Nginx（可选）
- 数据库：SQLite（开发）/ PostgreSQL（生产）
- 缓存服务：Redis（可选）

五、文件关系说明
1. 后端（app）提供数据接口与模型服务；
2. 前端（frontend）通过 API 与后端交互；
3. data 提供运行时所需数据文件以及用户画像刻画数据收集维度说明；
4. tests 用于验证系统完整性与稳定性；
5. Dockerfile 与 deploy.sh 用于环境构建与部署。

六、项目结构图
AI-PENSION-GUIDE-MAIN/
├── backend/                  # Python Flask 后端应用
│   ├── app/                  # Flask应用核心代码
│   │   ├── api/              # API蓝图 (接口层)
│   │   │   ├── __init__.py
│   │   │   ├── assistant.py
│   │   │   ├── dashboard.py
│   │   │   ├── future.py
│   │   │   ├── knowledge.py
│   │   │   ├── profile.py
│   │   │   └── recommendation.py
│   │   ├── services/         # 业务逻辑服务
│   │   │   ├── __init__.py
│   │   │   ├── analysis_service.py
│   │   │   ├── data_service.py
│   │   │   ├── future_service.py
│   │   │   ├── knowledge_graph_service.py
│   │   │   ├── nlp_service.py
│   │   │   ├── prediction_service.py
│   │   │   └── recommendation_service.py
│   │   └── __init__.py       # Flask应用工厂
│   ├── data/                 # 数据文件目录
│   │   └── pension_mock_500.csv
│   ├── tests/                # 测试文件目录
│   ├── .gitignore
│   ├── deploy.sh             # 一键部署脚本
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── README.md
│   ├── readme.txt
│   ├── requirements.txt      # Python依赖
│   ├── run.py                # 后端启动文件
│   └── test_api.sh           # API测试脚本
│
└── frontend/                 # React TypeScript 前端应用
    ├── dist/                 # 生产环境构建输出目录
    ├── src/                  # 核心源代码
    │   ├── pages/            # 页面组件
    │   │   ├── ActionPlan.tsx
    │   │   ├── Assistant.tsx
    │   │   ├── Dashboard.tsx
    │   │   ├── FutureInsights.tsx
    │   │   ├── OrganProfile.tsx
    │   │   └── OutcomeEvaluation.tsx
    │   ├── App.tsx           # 应用根组件与布局
    │   ├── main.tsx          # 应用入口文件
    │   └── styles.css        # 全局样式
    ├── .gitignore
    ├── index.html            # 应用入口HTML模板
    ├── package.json          # 项目依赖与脚本配置
    ├── package-lock.json
    ├── README.md
    ├── readme.txt
    ├── tsconfig.json         # TypeScript配置
    └── vite.config.ts        # Vite构建配置