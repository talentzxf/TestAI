# 北京现代四合院 · 3D 数字漫游体验 (Three.js)

基于 **Three.js** 构建的北京标准三进现代四合院 3D 交互式网页应用，严格参考北京传统三进四合院规制（[siheyuan.jpg](siheyuan.jpg)），融合青砖灰瓦、朱门影壁、垂花门、抄手游廊与现代全景玻璃幕墙、智能暖光系统。

## 功能亮点
- **标准三进四合院布局**：
  - **一进外院**：东南广亮大门、迎门砖雕影壁、南侧四间倒座房、西侧屏门。
  - **中轴门户**：雕梁画栋垂花门（带垂莲悬柱与苏式彩绘）。
  - **二进正院**：环院抄手游廊、院心十字青石甬道、太平锦鲤大鱼缸、西府海棠与百年红柿树。
  - **四大核心室内外空间一键切换**：
    - 🚪 **大门口**（广亮大门与砖雕影壁）
    - 🛋️ **正房客厅**（北房三间挑高水墨会客厅 + 左右对称东西耳房）
    - 💻 **主角房间**（东厢房现代双联屏创客卧室）
    - 🍵 **父亲房间**（西厢房新中式紫光檀书画雅室）
  - **三进后院**：正房北侧静谧后院与七间通长后罩房。
- **双浏览模式**：
  - 🦅 **鸟瞰模式**：支持高空环视、缩放与**屋顶半透明透视**俯瞰室内。
  - 🚶 **第一人称漫游**：支持 `W` `A` `S` `D` / 方向键及屏幕虚拟方向键在院落与房间内自由行走，支持鼠标拖拽或双击锁定视角。
- **昼夜光影切换**：支持 **「☀️ 晴朗白昼」** 与 **「🌇 北京黄昏 (华灯)」** 一键切换。

---

## 本地运行
项目为纯静态 ES Module 网页，无需打包编译。在项目根目录启动任意静态 HTTP 服务器即可：

```bash
# Python 3
python -m http.server 8080

# 或 Python 2
python -m SimpleHTTPServer 8080
```
随后在浏览器访问 `http://localhost:8080`。

---

## 部署到 GitHub Pages 流程

项目已内置 GitHub Actions 自动发布工作流 [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml) 与 [.nojekyll](.nojekyll) 文件。按以下三步即可完成上线：

### 第一步：推送到 GitHub 仓库
```bash
git init
git add .
git commit -m "feat: 北京现代三进四合院 3D 漫游应用"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<你的仓库名>.git
git push -u origin main
```

### 第二步：在 GitHub 仓库开启 Pages (GitHub Actions 模式)
1. 打开你的 GitHub 仓库页面，点击顶部菜单 **Settings**（设置）。
2. 在左侧边栏找到并点击 **Pages**。
3. 在 **Build and deployment** -> **Source** 下拉框中，选择 **`GitHub Actions`**（也可以直接选择 `Deploy from a branch` -> `main` / `/ (root)`，两种方式均完全兼容）。

### 第三步：访问线上地址
推送代码到 `main` 分支（或在 **Actions** 标签页手动点击 `Deploy to GitHub Pages` -> `Run workflow`）后，等待约 30 秒部署完成，即可通过以下地址访问：
`https://<你的用户名>.github.io/<你的仓库名>/`
