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

检查 JavaScript 语法、重复 HTML ID、页内导航、本地资源与图片替代文字。页面支持 8B/14B 摘要数字切换、原始图表放大、Toolathlon 案例分步切换、Python 语法高亮和换行控制、BibTeX 复制、移动端布局及键盘操作。宽表在手机上可横向滚动；点击图表可放大查看。

## 文件结构

```text
dist/
  index.html             页面正文、链接和引用
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

- 修改标题、论文/模型/数据链接：`dist/index.html`。
- 更新 8B/14B 摘要数字：`dist/app.js` 中 `scores`，同时更新 HTML 默认显示的 14B 结果、首屏统计和相关文案。正文的完整图表直接来自论文。
- 更新 Experimental Results 与 Analysis：`dist/index.html` 的 `#results` / `#analysis`，文案沿用论文对应小节的表述。
- 更新论文：替换 `dist/assets/ProgAgent.pdf`，并同步图表、原图和引用信息。
- GitHub 按钮指向用户提供的代码仓库：<https://github.com/LLLeoLi/verl>。单个 Hugging Face 按钮链接到同时包含模型与 SFT 数据的 collection。
- BibTeX 按用户提供的格式使用 `@misc{li2026progagent}`，年份为 2026，URL 为项目页；作者列表保留论文信息。

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

摘要及 BibTeX 作者依据所提供 PDF 的首页；首屏与页脚不展示作者信息；首屏之后直接展示 Figure 1，突出可验证环境合成与规模扩展；实验展示 Tables 1–3 和 Figure 3；Analysis 展示 Figures 4、7、8 和 Tables 4–6、8，对应论文 §5.1–5.4，正文精简为各小节的关键结论；案例完整展示 Appendix E.2 中的 Toolathlon-Verified 任务要求、四步代码及论文列出的输出，保留原有省略号与最终检查范围说明。案例是记录回放，不会调用外部工具。所有百分比为论文报告值，不代表独立复现。

页面没有添加未经确认的会议录用信息、arXiv 编号。AI 辅助实现；公开维护时请核对作者信息、实验数字和后续发布资源。
