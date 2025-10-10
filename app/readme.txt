文件夹名称：app
文件夹类型：后端源代码

一、文件夹作用
本文件夹为后端服务代码，基于 Flask/FastAPI 实现，包括接口定义、业务逻辑处理和数据访问层。

二、子文件夹概述
1. api/ :API接口层（表现层）。负责处理所有传入的HTTP请求，并将其路由到对应的业务逻辑。
2. services/ :业务逻辑层。负责执行核心的业务功能，如数据分析、模型预测、自然语言处理等。
3. __pycache__ :Python解释器自动生成的缓存目录，用于存放编译后的字节码文件以提高模块加载速度。(可忽略)
4. __init__.py :初始化模块配置。包含了创建和配置核心Flask应用实例的工厂函数。

三、api文件夹说明——API接口层
1. dashboard.py
 提供用户健康仪表盘所需的核心数据。
 创建一个名为 dashboard_bp 的Flask蓝图，通过调用 analysis_service.py 中的 get_dashboard_analysis 函数，为前端仪表盘页面封装和提供所有必要的后端数据。
2. assistant.py
 AI助手的核心，负责处理与用户的文本和语音交互。通过分析用户的输入，理解用户意图，实时更新用户的信息，完善用户画像。
 创建一个名为assistant_bp 的Flask蓝图，集成NLP服务 (nlp_service) 来处理和理解用户消息，实时更新用户的健康指标；接收base64编码的音频数据，使用 speech_to_text 函数将其转换为文本，最终返回处理结果及更新后的用户画像。
3. future.py
 提供对用户的健康状况进行未来预测和模拟，综合考量养老金规划中面临的潜在风险。
 创建一个名为 future_bp 的Flask蓝图，调用 future_service 中的 get_future_insights 函数以及用户提供的自定义健康参数来执行对用户的健康状况预测并返回结果。
4. knowledge.py
 为前端提供一个访问后端健康知识图谱和相关知识的接口。
 创建一个名为 knowledge_bp 的Flask蓝图，作为 knowledge_graph_service.py 的API网关，提供知识查询、实体关系检索和知识推荐等功能。
5. recommendation.py
 根据用户的健康画像生成个性化的建议，并跟踪这些建议的完成进度。
 创建一个名为 recommendation_bp 的Flask蓝图，结合数据服务 (data_service) 和分析服务 (analysis_service) 来获取用户的最新健康状况和画像，调用推荐服务 (recommendation_service) 来生成具体的健康建议和管理执行进度。

四、services文件夹说明——业务逻辑层
1. data_service.py
 数据访问层，作为所有其他服务获取原始数据的统一入口 。从数据源读取数据，并提供更新用户指标等基本的数据操作功能 。
2. analysis_service.py
 核心数据分析和用户画像生成。接收原始数据，封装关于用户画像定义、投资评分计算、风险评估和多维度分析的业务逻辑。
3. future_service.py
 通过时间序列预测对用户未来财务状况的预测和情景模拟。
4. knowledge_graph_service.py
 采用图遍历和数据检索逻辑，提供与投资知识库相关的查询服务 。它允许前端根据关键词或实体名称，从一个结构化的知识库中检索信息 。
5. nlp_service.py
 处理和理解用户的自然语言输入 。识别用户意图、分析情感，并从对话中提取关键信息 。
6. recommendation_service.py
 根据用户的画像和财务状况，生成个性化的投资行动方案 。

五、运行说明
1. 环境要求
 Python: 3.8 或更高版本
 pip:20.0 或更高版本
 Docker & Docker Compose : 最新稳定版本
2. 环境变量配置
 创建文件：在后端根目录下创建一个名为.env的文件
3. 手动部署
 克隆项目：git clone <your-repository-url>
 进入后端目录： cd app
 创建并激活虚拟环境：
  python -m venv venv
  source venv/bin/activate  # macOS/Linux
  # venv\Scripts\activate   # Windows
 安装依赖：pip install -r requirements.txt
 启动应用：python run.py

六、项目结构图
backend/
├── app/                      # Flask应用核心代码
│   ├── api/                  # API接口层 (蓝图)
│   │   ├── __init__.py
│   │   ├── assistant.py
│   │   ├── dashboard.py
│   │   ├── future.py
│   │   ├── knowledge.py
│   │   ├── profile.py
│   │   └── recommendation.py
│   ├── services/             # 业务逻辑服务
│   │   ├── __init__.py
│   │   ├── analysis_service.py
│   │   ├── data_service.py
│   │   ├── future_service.py
│   │   ├── knowledge_graph_service.py
│   │   ├── nlp_service.py
│   │   ├── prediction_service.py
│   │   └── recommendation_service.py
│   └── __init__.py           # 应用工厂初始化
├── data/                     # 数据文件目录
│   └── pension_mock_500.csv
├── tests/                    # 测试代码目录
├── .gitignore                # Git忽略配置
├── deploy.sh                 # 一键部署脚本
├── docker-compose.yml        # Docker容器编排
├── Dockerfile                # Docker镜像配置文件
├── README.md                 # 项目文档 (Markdown)
├── readme.txt                # 项目文档 (纯文本)
├── requirements.txt          # Python依赖列表
├── run.py                    # 应用启动文件
└── test_api.sh               # API一键测试脚本