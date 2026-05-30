---
name: skill-usage
description: "技能使用情况追踪与分析。记录每次调用了哪个技能、调用次数、成功率，生成使用统计报告，发现未使用但可能相关的技能。当用户说 skill-usage、技能使用、用了哪些技能、技能统计、skill stats 时触发。每次对话自动记录技能调用。"
metadata:
  version: "1.0.0"
  last_updated: "2026-05-28"
  status: active
  task_type: meta
  related_skills:
    - orchestrator
---

# Skill Usage — 技能使用追踪

记录和分析技能使用情况。每次 orchestrator（或直接）调用技能时，自动记录。

## 记录格式

每次调用技能后，追加到 `C:\Users\王\.claude\skills\skill-usage\usage-log.jsonl`：

```json
{"timestamp": "ISO时间", "skill": "技能名", "task": "任务简述", "result": "success|fail|partial", "note": "备注"}
```

## 核心功能

### 1. 查看使用统计
用户说"技能统计"、"skill stats"、"用了哪些技能"时，解析 usage-log.jsonl 输出：

```
技能使用统计（时间范围）
────────────────────────
技能名          调用次数  成功率  最近使用
academic-writing    12    100%   2026-05-28
deep-research        8     87%   2026-05-27
code-review          5    100%   2026-05-26
...
────────────────────────
总计: N 个技能, M 次调用
```

### 2. 推荐未使用技能
用户说"推荐技能"、"还有什么技能可用"时，根据当前任务类型，从全部技能中找出相关但未被使用过的技能推荐。

### 3. 使用趋势
用户说"技能趋势"时，按周/月聚合展示各类技能的使用趋势。

### 4. 技能清单
用户说"所有技能"、"skill list"、"技能列表"时，按分类列出所有可用技能及其用途简述。

## 实现方式

- 存储：JSONL 文件追加写入，每行一条记录
- 统计：直接解析 JSONL 文件，用 Bash/python 聚合
- 技能列表：读取 `C:\Users\王\.claude\skills\` 目录下所有 SKILL.md 的 name 和 description

## 记录规则

1. 每次通过 orchestrator 调度技能后，自动追加一条记录
2. 直接调用 Skill 工具时，也追加记录
3. 不要重复记录同一任务多次调用
4. 简单任务（没用任何技能）不记录
