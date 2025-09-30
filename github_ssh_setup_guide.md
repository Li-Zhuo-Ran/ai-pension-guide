# GitHub 协作开发完整指南

## 第一部分：上传代码到自己的仓库

### 1. GitHub 准备
1. 登录 [GitHub](https://github.com)
2. 点击 "+" → "New repository"
3. 输入仓库名（如 `ai-pension-guide`），选择私有，点击 "Create repository"
4. 进入 Settings → SSH and GPG keys → "New SSH key"
5. 粘贴公钥：
   ```
   ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPkHbhclcHR0dgR/RV9NiC6ub/QCoyrpFRROrjkcF4Ae your_email@example.com zhuoranli608@gmail.com
   ```
6. 点击 "Add SSH key"
7. 返回仓库，点击 "Code" → SSH，复制地址如 `git@github.com:username/repo.git`

### 2. 本地终端操作
```bash
# 检查 SSH key
ls -al ~/.ssh

# 启动 SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# 测试连接
ssh -T git@github.com

# 初始化仓库
cd /path/to/project
git init
git add .
git commit -m "Initial commit"

# 关联远程
git remote add origin git@github.com:username/repo.git
git push -u origin main
```

## 第二部分：修改别人的代码

### 1. Fork 仓库
1. 访问目标仓库页面
2. 点击右上角 "Fork"，创建你的副本

### 2. 克隆和设置
```bash
git clone git@github.com:yourusername/forked-repo.git
cd forked-repo
git remote add upstream git@github.com:original-author/repo.git
```

### 3. 创建分支修改
```bash
git checkout -b feature/your-change
# 编辑文件
git add .
git commit -m "Describe your changes"
git push origin feature/your-change
```

### 4. 创建 Pull Request
1. 访问你的 Fork 页面
2. 点击 "Compare & pull request"
3. 填写标题、描述，点击 "Create pull request"

### 5. 同步上游更新
```bash
git checkout main
git pull upstream main
git push origin main
```

## 第三部分：接收别人的修改

### 1. 查看 Pull Request
1. 访问你的仓库
2. 点击 "Pull requests"
3. 选择 PR 查看文件变化

### 2. 审查代码
1. 查看代码差异
2. 添加行内评论
3. 请求修改或批准

### 3. 合并 Pull Request
1. 点击 "Merge pull request"
2. 选择合并方式：
   - Merge commit：保留完整历史
   - Squash：压缩为单个提交
   - Rebase：重写历史
3. 点击 "Confirm merge"

### 4. 处理冲突（如果有）
```bash
git checkout main
git pull origin main
# 如果冲突，手动解决
git add resolved-files
git commit
git push
```

## 第四部分：日常协作技巧

### 分支基础概念
**master/main**：项目的主干，稳定版本，所有正式代码在这里。  
**分支**：主干的副本，用于开发新功能而不影响主代码。  

区别：主分支保持干净稳定，分支用来大胆开发。  
什么时候用分支：开发新功能、修复bug、实验修改。  
什么时候用主分支：合并测试通过的分支后更新。

### 分支管理
```bash
# 创建分支
git checkout -b new-feature

# 切换分支
git checkout main

# 删除分支
git branch -d feature-branch
```

### 解决合并冲突
1. 拉取时冲突：编辑冲突文件，移除冲突标记
2. 添加修改：`git add .`
3. 提交：`git commit`

### 撤销更改
```bash
# 撤销暂存
git reset HEAD file

# 撤销提交
git reset --soft HEAD~1

# 强制推送（谨慎使用）
git push --force-with-lease
```

### 协作最佳实践
- 经常拉取上游更改
- 使用描述性提交信息
- 小步提交，避免大合并
- 代码审查前自测

## 故障排除

### SSH 问题
- 重新添加 key：`ssh-add ~/.ssh/id_ed25519`
- 检查 agent：`ssh-add -l`

### 推送失败
- 检查远程：`git remote -v`
- 确认分支：`git branch`

### 权限错误
- 确保 SSH key 添加正确
- 检查仓库权限设置









## 第五部分：完整协作工作流（一人主导，多人贡献）

### 场景描述
你作为主要开发者，负责上传初始代码到 GitHub。同事拉取代码，添加新功能后提交给你。你审查、修改、合并。

### 步骤1：主要开发者上传初始代码
1. 按第一部分完成 GitHub 仓库创建和 SSH 配置
2. 本地初始化项目：
   ```bash
   cd /Users/lizhuoran/Desktop/ai-pension-guide
   git init
   git add .
   git commit -m "Initial project setup"
   git remote add origin git@github.com:yourusername/ai-pension-guide.git
   git push -u origin main
   ```
3. 在 GitHub 设置仓库权限：Settings → Collaborators → 添加同事用户名

   **权限设置说明**：
   - **不添加 Collaborators**：同事可以 Fork 你的仓库，修改后提交 Pull Request。你审查后决定是否合并。适合开源项目或不完全信任的贡献者。
   - **添加 Collaborators**：同事可以直接推送到你的仓库，无需 Fork。适合信任的团队成员，协作更高效。
   - **区别**：
     - 无 Collaborators：同事修改代码 → Fork → PR → 你合并（间接修改）
     - 有 Collaborators：同事直接推送分支 → PR → 你合并（直接修改）
   - 推荐：如果是核心团队，添加 Collaborators；如果是外部贡献，保持默认通过 PR 贡献。

### 步骤2：同事拉取代码并开发
1. 同事克隆仓库：
   ```bash
   git clone git@github.com:yourusername/ai-pension-guide.git
   cd ai-pension-guide
   ```

2. 创建功能分支：
   ```bash
   git checkout -b feature/new-function
   ```

3. 开发新功能：
   - 编辑文件
   - 测试功能
   ```bash
   git add .
   git commit -m "Add new function: description"
   ```

4. 推送分支：
   ```bash
   git push origin feature/new-function
   ```

5. 创建 Pull Request：
   - 访问仓库页面
   - 点击 "Compare & pull request"
   - 填写标题："Add new function"
   - 描述功能和更改
   - 点击 "Create pull request"

### 步骤3：你审查和修改同事的代码
1. 收到 PR 通知，访问仓库 "Pull requests"
2. 查看 PR：
   - 阅读描述
   - 查看 "Files changed" 标签，检查代码差异
   - 添加评论：`@同事用户名 这里的逻辑可以优化`

3. 请求修改（如果需要）：
   - 点击 "Request changes"
   - 详细说明需要改什么

4. 同事修改后，重新推送：
   ```bash
   # 同事本地修改
   git add .
   git commit -m "Fix: address review comments"
   git push origin feature/new-function
   ```

5. 你重新审查，批准：
   - 点击 "Approve"

### 步骤4：合并代码到主分支
1. 点击 "Merge pull request"
2. 选择合并方式：
   - **Merge commit**：保留完整历史（推荐新手）
   - **Squash and merge**：压缩为单个提交（保持主分支干净）
   - **Rebase and merge**：重写历史（高级）

3. 点击 "Confirm merge"
4. 删除合并后的分支：
   ```bash
   git push origin --delete feature/new-function
   ```

### 步骤5：后续协作循环
1. 你推送主分支更新：
   ```bash
   git checkout main
   git pull origin main
   ```

2. 同事同步最新代码：
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/next-feature
   ```

3. 重复步骤2-4

### 高效协作 tips
- **分支命名规范**：`feature/功能名`、`fix/bug描述`、`docs/文档更新`
- **提交信息清晰**：`Add user login feature` 而不是 `update`
- **小步提交**：功能完成后立即提交，避免大块更改
- **定期同步**：同事每天 `git pull origin main` 同步最新代码
- **代码审查**：重点检查逻辑、性能、安全性
- **冲突预防**：同事开发前先拉取主分支

### 处理常见情况
- **冲突发生**：同事推送前先 `git pull origin main`，手动解决冲突
- **紧急修复**：直接在 main 分支修复，但事后创建分支重做
- **功能废弃**：关闭 PR，不合并，删除分支

这个工作流确保你控制主分支质量，同事高效贡献，团队协作有序。</content>
<filePath>/Users/lizhuoran/Desktop/ai-pension-guide/github_ssh_setup_guide.md