---
name: project-tracker
description: Use when the user asks about project status, progress, backlog, or "what's left to do". Also use proactively when the user is juggling multiple projects and seems scattered — scanning all active project directories under D:\deepseek\ and producing a status dashboard with priority ordering. Triggers on phrases like "项目状态", "进度", "看板", "还有哪些没做", "接下来做什么", "whats left", "remaining tasks".
---

# 多项目看板

## 为什么需要这个技能

多项目并行时，人类大脑不擅长追踪超过3个任务的完成状态。之前出现过 supreme-waffle 代码写完了但从未跑过测试、ComfyUI 调不通就搁置无人跟进的情况——这些不是因为能力不够，而是因为"忘了要闭环"。这个技能强制建立一个外部记忆系统，每天看一眼就知道该做什么。

## 执行流程

### 1. 扫描活跃项目
遍历 `D:\deepseek\` 下的一级子目录，跳过以下类型：
- 缓存/依赖目录（`node_modules`, `__pycache__`, `.git`）
- 纯数据文件目录
- 7天内无任何文件变更的冷目录

### 2. 评估每个项目
对每个活跃项目判断：
- **状态**: 🟢 active（今天有活动）/ 🟡 idle（24h内无变更）/ 🔴 blocked（有未解决报错）/ ✅ done
- **完成度**: 粗略百分比，基于核心功能是否可运行（不是代码行数）
- **最后活动**: 最近文件修改时间
- **遗留问题**: 该项目的报错日志、未完成的 TODO、被搁置的功能

### 3. 输出看板

```
## 项目看板 — {日期}

| 优先级 | 项目 | 状态 | 完成度 | 最后活动 | 遗留问题 |
|--------|------|------|--------|---------|---------|
| 🔴 1 | xxx | blocked | 70% | 2h ago | API调用失败未定位 |

## ⚠️ 阻塞警告
- supreme-waffle: 核心代码写完5天未跑过首测

## 建议今日主攻
不超过2个项目，优先选 🔴 阻塞项
```

### 4. 标记阻塞项
将超过24h未推进但因"忘了"而非"等外部依赖"的项目，用红色警告单独列出。

### 5. 维护项目状态文件
将当前状态写入 `D:\deepseek\daily-reports\project-status.json`，供下次对比用。

## 输出规则
- 始终按优先级排序：blocked > active > idle
- 阻塞警告只列真正需要关注的问题，不列低优先级待办
- 建议主攻项目必须 ≤2 个
