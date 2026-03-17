# 部署指南

## 方案一：Vercel 部署（推荐 ⭐）

### 前置要求
- 有 GitHub 账号
- 安装了 Git

### 步骤

1. **创建 GitHub 仓库**
   - 访问 https://github.com/new
   - 仓库名：`bazi-teaching-web`（或其他你喜欢的名字）
   - 选择 Public 或 Private
   - 点击 "Create repository"

2. **初始化 Git 并上传**
   ```bash
   cd /Users/qinweipeng/.openclaw/workspace/bazi-miniprogram/web
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/你的用户名/bazi-teaching-web.git
   git push -u origin main
   ```

3. **部署到 Vercel**
   - 访问 https://vercel.com
   - 用 GitHub 账号登录
   - 点击 "New Project"
   - 选择刚创建的仓库
   - **重要：** 在 "Configure Project" 中，把 "Root Directory" 改为 `./`（保持默认即可，因为我们已经在 web 目录）
   - 点击 "Deploy"
   - 等待 1-2 分钟，部署完成！

4. **获取访问链接**
   - 部署完成后会显示一个类似 `https://bazi-teaching-web.vercel.app` 的链接
   - 这个链接可以分享给任何人！

---

## 方案二：GitHub Pages 部署

### 步骤

1. **创建 GitHub 仓库**（同方案一）

2. **上传代码**（同方案一）

3. **启用 GitHub Pages**
   - 进入仓库的 Settings
   - 左侧菜单找到 "Pages"
   - 在 "Build and deployment" 中：
     - Source: 选择 "Deploy from a branch"
     - Branch: 选择 `main` 分支，文件夹选 `/ (root)`
   - 点击 "Save"

4. **等待部署**
   - 等待 2-5 分钟
   - 刷新页面，会显示访问链接：
     `https://你的用户名.github.io/bazi-teaching-web/`

---

## 方案三：Netlify 部署（拖拽上传，最简单）

### 步骤

1. 访问 https://app.netlify.com
2. 注册/登录账号
3. 把 `web` 文件夹直接拖拽到上传区域
4. 等待上传完成，立即获得访问链接！

**优点：** 不用 GitHub，不用 Git，直接拖拽

---

## 更新网站

无论用哪个方案，更新都很简单：

### Vercel / GitHub Pages
```bash
git add .
git commit -m "更新内容"
git push
```
Vercel 会自动重新部署，GitHub Pages 会自动更新。

### Netlify
重新拖拽文件夹上传即可。

---

## 自定义域名（可选）

如果有自己的域名，所有平台都支持绑定自定义域名。

---

**推荐：先用 Vercel，最快最简单！** 🚀
