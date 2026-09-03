---
title: Git 工作流最佳实践
date: 2026-05-08
tags: [Git, 工具]
category: 工具
summary: 掌握 Git 工作流，让团队协作更加高效。
---

# Git 工作流最佳实践

Git 是现代开发的必备工具，但很多人只用到了基础功能。

## 常用命令速查

### 基础操作

```bash
# 查看状态
git status

# 添加文件
git add .
git add -p  # 交互式添加

# 提交
git commit -m "feat: 添加新功能"

# 推送
git push origin main
```

### 分支管理

```bash
# 创建并切换分支
git checkout -b feature/new-feature

# 查看分支
git branch -a

# 合并分支
git merge feature/new-feature

# 删除分支
git branch -d feature/new-feature
```

## 提交规范

使用 Conventional Commits 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具相关

### 示例

```bash
# 好的提交信息
git commit -m "feat(auth): 添加用户登录功能"
git commit -m "fix(api): 修复数据获取失败问题"
git commit -m "docs: 更新 README 文档"

# 不好的提交信息
git commit -m "update"
git commit -m "fix bug"
git commit -m "改了一点东西"
```

## Git Flow 工作流

### 分支策略

```
main (生产)
  ↑
develop (开发)
  ↑
feature/* (功能)
  ↑
hotfix/* (热修复)
```

### 工作流程

1. **创建功能分支**
```bash
git checkout develop
git pull
git checkout -b feature/user-profile
```

2. **开发并提交**
```bash
git add .
git commit -m "feat(profile): 添加用户资料页面"
```

3. **推送并创建 PR**
```bash
git push origin feature/user-profile
```

4. **代码审查后合并**
```bash
git checkout develop
git merge feature/user-profile
git push origin develop
```

## 实用技巧

### 1. 暂存更改

```bash
# 暂存当前更改
git stash

# 恢复暂存
git stash pop

# 查看暂存列表
git stash list
```

### 2. 查看历史

```bash
# 简洁的日志
git log --oneline

# 图形化显示
git log --graph --oneline --all

# 查看某次提交
git show <commit-hash>
```

### 3. 撤销操作

```bash
# 撤销工作区更改
git checkout -- <file>

# 撤销暂存
git reset HEAD <file>

# 回退到某次提交
git reset --hard <commit-hash>
```

### 4. 解决冲突

```bash
# 1. 拉取最新代码
git pull

# 2. 解决冲突后
git add .
git commit -m "merge: 解决合并冲突"
```

## Git 配置

### 推荐配置

```bash
# 设置用户信息
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# 设置默认分支名
git config --global init.defaultBranch main

# 设置别名
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
```

### .gitignore

```gitignore
# 依赖
node_modules/

# 构建产物
dist/
build/

# 环境变量
.env
.env.local

# IDE
.vscode/
.idea/

# 系统文件
.DS_Store
Thumbs.db
```

## 总结

好的 Git 实践：

- ✅ 使用有意义的提交信息
- ✅ 遵循提交规范
- ✅ 及时提交，小步快跑
- ✅ 善用分支管理
- ✅ 定期同步远程代码

掌握这些技巧，你的 Git 使用体验会大大提升！

---

**相关资源：**
- [Git 官方文档](https://git-scm.com/doc)
- [Conventional Commits](https://www.conventionalcommits.org)
- [Git Flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
