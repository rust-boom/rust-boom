---
description: "每周核验 Rust 资源资料并提出小批量更新 PR"
on:
  schedule:
    - cron: "0 1 * * 1"
  workflow_dispatch:
permissions:
  contents: read
  issues: read
  pull-requests: read
engine: copilot
network:
  allowed:
    - defaults
    - github
    - node
    - raw.githubusercontent.com
    - api.github.com
tools:
  github:
    toolsets: [default, issues, pull_requests]
  bash: true
steps:
  - uses: actions/setup-node@v7
    with:
      node-version: '22'
  - name: Install catalog dependencies
    run: npm ci
safe-outputs:
  create-pull-request:
    title-prefix: "[AI 维护] "
    draft: false
    max: 1
    fallback-as-issue: false
    allowed-files:
      - resources/**/*.md
      - resources/index.json
    protected-files: blocked
timeout-minutes: 30
---

# Rust Boom 定期资源维护

遵循根 AGENTS.md，并读取 .agents/skills/rust-boom-maintenance/SKILL.md 和 CONTRIBUTING.md。
本任务通过 safe-outputs 创建 PR，不调用本地交付脚本，不运行 git push 或 gh pr create。

先检查未合并 PR。若已有标题以 [AI 维护] 开头的资源维护 PR，结束本次巡检，不创建重复 PR。
本轮只检查最多 5 项已有资源：候选池先取待核验且主链接为 GitHub 仓库的资源；
若这些资源已全部核验，再取其他主链接为 GitHub 仓库的已有资源。
候选池按稳定 ID 排序，用 JavaScript 的 Math.floor((Math.floor(Date.now() / 86400000) + 719163) / 7) 作为 UTC 周序号，
从 (周序号 * 5) % 候选数 开始循环选取最多 5 个不同条目，
避免每周总是检查相同的前 5 项；候选池为空时结束。不要自动新增资源。

读取项目公开 README、仓库 archived 标志和维护记录，核对介绍与当前资料的一致性。
只在实际读取的一手资料能证明需要更新时修改正文或状态。说明核验日期和来源。
不要仅凭网站访问失败将项目标记为停止维护，不根据搜索摘要编造事实。
不能访问的外部网站留待后续处理；本工作流只授予受限的 GitHub/依赖安装网络访问。

最多更新 5 项源资源，保持 ID、分类和已有有效链接。
不要改分类清单、Agent/技能指令、工作流、依赖、Rust 代码、Issue 表单或其他目录。
执行 npm run catalog、npm run check 和 npm test。
核对 diff 仅包含 resources 下 Markdown 资源/导航和 resources/index.json。
出现无关生成变更或检查失败时先解决；无法解决则说明失败，不能交付未验证补丁。

没有实质内容更新就安静结束，不为了记录巡检日期创建修改或 PR。
有更新时使用 safe-outputs 创建一个非草稿 PR，目标为仓库默认分支，描述每项更新、
实际读取的证据 URL 与日期、验证结果；由独立 AI 评审工作流检查并按规则合并。
仅对本 PR 完整解决的真实 Issue 在 PR 正文填写 Closes #编号；
例行维护没有关联 Issue 时不要编造编号。不自行合并，不提前关闭 Issue。
