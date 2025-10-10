文件夹名称：fronted
文件夹类型：前端源代码

一、文件夹作用
用于实现用户界面与交互逻辑。本项目是基于React（使用TypeScript）和Vite构建的现代化单页面应用（SPA）。实现、负责用户界面的展示、用户交互的处理以及与后端API的数据通信。

二、根目录文件说明
1. package.json:定义了项目名称、版本、依赖库（如 React, Ant Design, ECharts）和脚本命令（如 npm run dev）
2. package-lock.json:自动生成的文件，用于锁定 package.json中依赖库的确切版本，确保团队成员和生产环境安装的依赖版本完全一致。
3. vite.config.ts:Vite 构建工具的配置文件。在这里可以配置开发服务器、代理设置（用于跨域请求后端API）、构建选项等。
4. tsconfig.json:TypeScript 编译器的配置文件，用于定义编译选项，如目标JavaScript版本、模块系统和代码检查规则。
5. index.html:单页面应用的入口HTML文件。React应用最终会被Vite打包并注入到这个文件中。
6. readme.txt:该文件夹项目的说明文档。

三、主文件夹说明
1. src/ 
 前端应用核心文件，包含了所有的业务逻辑、组件和页面。
 （1）pages/:
    Dashboard.tsx：高度可视化与数据驱动的智能仪表盘界面，用于全面展示用户的养老金投资组合健康状况，对用户的消费与资产状况进行分析并提供相应建议。
    Assistant.tsx：AI助手交互页面。集成语音或文本功能与AI养老金顾问进行实时交互，在AI回复中展现后端分析的用户意图和情绪状态，动态化的更新用户画像。
    FutureInsights.tsx：未来洞察与模拟界面。以用户的财务行为为参数，预测和洞察用户的消费、存储等对未来养老金状况的长期影响。
    OrganProfile.tsx：精准用户画像分析页面。将用户画像划分为“财务基础”、“债务管理”、“投资配置”等多个核心财务维度，为每个财务维度提供具体的策略建议，包括预期效果、证据等级等。
    ActionPlan.tsx：展示AI为用户生成的个性化财务行动计划，并将任务分解为每日、每周和长期三个维度，方便用户执行和跟踪。
    OutcomeEvaluation.tsx：评估和展示用户在执行理财计划后取得的预期成果和财务成就。
 （2）App.tsx：前端应用的根组件和布局管理器。定义应用的整体结构，包括侧边栏导航、顶部标题栏、内容显示区和页脚。
 （3）main.tsx：React应用的启动入口文件。找到HTML页面中的根DOM元素，将 App 组件渲染到这个元素上。
 （4）styles.css：定义整个应用的视觉主题和设计语言，赋予应用深色的、充满科技感的外观。
2. dist/：项目打包后的静态文件
    index.html:应用的入口HTML文件。引入打包后的CSS文件，为整个应用应用上样式 。加载并执行打包后的主JavaScript文件（该文件包含了React框架和所有应用逻辑）。
    assets/index-l6DYtCkp.js:包含整个应用所有功能逻辑（如页面交互、数据处理）和框架代码的压缩版JavaScript代码
    assets/index-KbkdgEPF.css：包含整个应用所有视觉样式（如颜色、布局、字体）的压缩版CSS代码 。
3. node_modules/
 用于存放所有在 `package.json` 中声明的项目依赖库。

四、运行说明
1. 环境要求
 Node.js: v18.0.0 或更高版本
 npm: v9.0.0 或更高版本 (通常随Node.js安装)
 Web Browser: 最新版本的 Chrome, Firefox, Edge, 或 Safari
2. 安装依赖
 克隆项目到本地: git clone <your-repository-url>
 进入前端项目目录: cd frontend
 安装项目依赖: npm install
3. 运行开发环境
 启动开发服务器: npm run dev
 在浏览器中访问: http://localhost:5173 (或其他Vite默认的端口)

五、脚本命令说明
1. npm run dev: 启动本地开发服务器，支持热重载
2. npm run build: 将项目源代码打包构建到 dist 文件夹，用于生产环境部署。
3. npm run preview: 在本地预览生产环境构建后的应用。

六、 项目结构图
frontend/
├── dist/                   # 生产环境构建输出目录
├── src/                    # 核心源代码目录
│   ├── pages/              # 页面组件
│   │   ├── ActionPlan.tsx
│   │   ├── Assistant.tsx
│   │   ├── Dashboard.tsx
│   │   ├── FutureInsights.tsx
│   │   ├── OrganProfile.tsx
│   │   └── OutcomeEvaluation.tsx
│   ├── App.tsx             # 应用根组件与布局
│   ├── main.tsx            # 应用入口文件
│   └── styles.css          # 全局样式文件
├── index.html              # 应用入口HTML模板
├── package.json            # 项目依赖与脚本配置
├── package-lock.json       # 锁定依赖版本
├── README.md               # 项目说明文档 (Markdown)
├── readme.txt              # 项目说明文档 (纯文本)
├── tsconfig.json           # TypeScript编译器配置
└── vite.config.ts          # Vite构建配置文件