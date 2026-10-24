# 拾光阅读 · CET-6 Reading Lab

一个帮助自己读进去、记住词、找到原文依据的英语六级阅读练习站。纯 HTML、CSS 与 JavaScript 模块，无需安装依赖或设置 API 密钥。

## 可以做什么

- 在练习集选择 6 篇原创模拟阅读（30 道题），按主题搜索；内含逐题答案、解析和原文依据。
- 按年份选择 2021–2025 年的 10 个真题原题入口。它们是外部链接，试卷全文尚未内置；可导入自己持有的材料进行站内练习。
- 分段专注阅读或全文阅读；点击单词、划选词组，记录释义与笔记。
- 展开本段中文译文，或查看全文中英对照；校订译文并在本机保存。
- 导入文章、题目、答案、依据段落、解析及可选的逐段中文译文。
- 对缺少译文的段落，主动请求 MyMemory 在线参考翻译（第三方服务可能限额或不可达）；也可手动补充。
- 完成后汇总本文命中的学习词表与自己记录的生词，进行翻卡复习，并导出 CSV。

所有个人练习、作答、生词和译文校订保存在当前浏览器的 localStorage。公开部署不会把访客的本机记录合并为公开题库。清除浏览器数据会移除这些记录；更换设备不会自动同步。

## 本地运行

在项目根目录运行：

```bash
python -m http.server 8080 --directory dist
```

打开 `http://localhost:8080`。请通过 HTTP 服务访问，不要直接双击 HTML 文件。

验证（Node.js 22 或更新版本）：

```bash
node --check dist/app.mjs
node --test
```

## 上传 GitHub / 启用 GitHub Pages

1. 在自己的 GitHub 账号下创建仓库，例如 `sixthlight-cet6-reading`。
2. 解压源码包后，把源码文件上传到仓库根目录（不是上传 ZIP 本身），保留 `dist/`、`tests/` 与 `.github/workflows/pages.yml` 的相对结构；主分支使用 `main`。
3. 在仓库 Settings → Pages → Build and deployment，将 Source 设为 GitHub Actions。
4. 推送后查看 Actions 中的 Verify and deploy GitHub Pages；成功后部署任务会给出 GitHub Pages 地址。

已提供 Pages 工作流，先运行检查和测试，再将 `dist/` 部署。样式和脚本使用相对路径，兼容 `username.github.io/repository/` 子路径。不要把 Sites 身份配置、Git 凭据或 `.env` 文件上传到公开仓库。

本项目也可部署到任意支持静态文件的托管服务，发布目录选择 `dist`。

## 目录

| 文件 | 用途 |
| --- | --- |
| `dist/index.html` / `style.css` / `app.mjs` | 页面与交互 |
| `dist/collection.mjs` | 原创练习、译文与真题入口 |
| `dist/data.mjs` | 初始练习与学习词表 |
| `dist/core.mjs` | 导入、校验、筛选、计分 |
| `dist/translation.mjs` | 在线翻译的分段和错误处理 |
| `tests/` | 行为与题库内容校验 |
| `CONTENT-SOURCES.md` | 内容来源与第三方服务说明 |

详见 [内容与来源](CONTENT-SOURCES.md)。项目代码与原创练习采用 [MIT 许可](LICENSE)；外部试卷不属于本项目的再许可内容。词表是精选学习表达，不是按统计频次计算的官方词频排名。
