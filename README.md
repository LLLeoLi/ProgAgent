# ProgAgent project page

独立的 ProgAgent 论文展示网站。纯 HTML / CSS / JavaScript，无前端依赖、无构建步骤，可直接通过 GitHub Pages 发布。

- 目标网站：<https://llleoli.github.io/ProgAgent/>
- 论文：*ProgAgent: Learning Tool Orchestration through Programmatic Training*
- 个人主页：<https://llleoli.github.io/>
- 模型合集：<https://huggingface.co/collections/LLLeo612/progagent>
- SFT 数据：<https://huggingface.co/datasets/LLLeo612/ptc-sft-data>
- 风格参考：<https://anjingkun.github.io/SafeSteer/>（独立实现，未复制其代码）

## 本地预览

需要 Node.js 18+，不需要 `npm install`。

```bash
npm start
```

打开 <http://127.0.0.1:4173/ProgAgent/>。可用 `PROGAGENT_PORT=8080 npm start` 更换端口；需要远程转发时，可设置 `PROGAGENT_HOST=0.0.0.0`。也可以直接打开 `dist/index.html`；复制引用功能在不支持剪贴板的环境中会选中文字供手动复制。

## 校验

```bash
npm run check
```

检查 JavaScript 语法、重复 HTML ID、页内导航、本地资源与图片替代文字。页面支持 8B/14B 摘要数字切换、原始图表放大、完整消融表展开、记录案例步骤切换、BibTeX 复制、移动端布局及键盘操作。宽表在手机上可横向滚动；点击图表可放大查看。

## 文件结构

```text
dist/
  index.html             页面正文、作者、链接和引用
  styles.css             响应式样式
  app.js                 交互及论文表 2 的摘要数字
  assets/
    ProgAgent.pdf        用户提供的论文
    overview.svg         论文源文件的矢量方法图
    overview.png         用于分享预览的方法图
    *.svg / *.png        论文原始图表的网页版本
    *.pdf                原始图表的 PDF 下载版本
    sources.json         图表与论文源文件的对应关系
    favicon.svg          网站图标
scripts/
  serve.mjs              本地静态服务器
  check.mjs              页面完整性检查
  import-paper.py        从源文件与 PDF 导出图表
.github/workflows/
  pages.yml              GitHub Pages 自动部署
```

## 更新内容

- 修改标题、作者、论文/模型/数据链接：`dist/index.html`。
- 更新 8B/14B 摘要数字：`dist/app.js` 中 `scores`，同时更新 HTML 默认显示的 14B 结果、首屏统计和相关文案。正文的完整图表直接来自论文。
- 更新 Experimental Results 与 Analysis：`dist/index.html` 的 `#results` / `#analysis`，文案沿用论文对应小节的表述。
- 更新论文：替换 `dist/assets/ProgAgent.pdf`，并同步图表、原图和引用信息。
- 训练代码尚未提供公开链接，页面标记为 Coming soon。不要把本网站源码仓库误标为训练代码。
- BibTeX 暂用 `@unpublished`；有 arXiv 或正式发表信息后应替换为正式引用。

## 导入论文图表

图使用论文源目录 `figures/` 中的原始 PDF；表使用给定编译稿的原表，并与 `tables/*.tex` 核对。网页尽量使用 SVG 保留矢量清晰度；Figure 3 的密集填充纹理会使 SVG 过大，因此网页使用 2400px PNG，同时提供原始 PDF。

```bash
uv run --with pymupdf python scripts/import-paper.py \
  --source-dir /path/to/ptc-paper-writing \
  --paper /path/to/ICLR27_ProgAgent.pdf
```

导入脚本不会修改论文源目录。表格裁剪坐标对应本次提供的 PDF；论文重新排版后需核对页码和裁剪区域，并检查导出结果。

## 部署

仓库名为 `ProgAgent`，owner 为 `LLLeoLi`。在 GitHub 仓库 Settings → Pages 选择 **GitHub Actions**。提交到 `main` 后，工作流会检查文件并部署 `dist/`，项目路径为 `/ProgAgent/`。所有本地资源使用相对链接，也支持其他静态托管。

本网站应使用独立仓库，不需要修改个人主页的 Jekyll 配置。后续可在主页的论文列表添加一个指向项目页的链接。

## 内容依据

作者、机构与摘要依据所提供 PDF 的首页；方法图为 Figure 1；DTC/PTC 对比为 Figure 2；实验展示 Tables 1–3、Figure 3 与完整消融 Table 7；Analysis 展示 Figures 4、7、8 和 Tables 4–6、8，对应论文 §5.1–5.4；案例依据 Appendix E.1。案例是记录回放，不会调用外部工具。所有百分比为论文报告值，不代表独立复现。

页面没有添加未经确认的会议录用信息、arXiv 编号或训练代码链接。AI 辅助实现；公开维护时请核对作者信息、实验数字和后续发布资源。
