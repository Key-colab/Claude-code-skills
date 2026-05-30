---
name: log-analyzer
description: Use when the user encounters errors, asks "为什么失败了", "什么原因", "分析日志", "看看哪里出错了", or when there are accumulated debug logs (*.log, npm-debug, API response dumps) sitting unanalyzed. Also use proactively when a command fails with unclear error output — systematically scan related log files, extract key errors, identify patterns, and give a diagnosis with fix suggestions.
---

# 日志自动诊断

## 为什么需要这个技能

两天内出现了两次"日志堆在那里但没人看"的情况：

- 5/27: 11 个 npm-debug 日志堆积，npm 反复报错但无人分析根因，只知道"npm有问题"
- 5/28: ComfyUI 两次 API 调用的响应日志大小异常（1.4MB vs 784B），差异巨大但无人对比

日志是系统在告诉你哪里坏了。忽略日志 = 在黑暗中修东西。这个技能让分析日志变成一键操作，降低诊断的启动成本。

## 执行流程

### 1. 日志发现
- 如果用户指定了具体文件，直接分析
- 否则扫描 `D:\deepseek\` 下所有匹配模式的文件：
  - `*-debug-*.log`, `*.log`
  - `npm-debug*.log`
  - `try*` (API 响应 dump)
  - `.stderr`, `traceback` 文件

### 2. 信息提取
从每个日志中提取：
- 错误码 / HTTP 状态码（如 404, 500, ECONNREFUSED）
- 异常类型和堆栈第一行
- 超时/连接拒绝/DNS解析失败标记
- JSON 解析错误位置

### 3. 模式识别
统计错误频率并归类：

| 模式 | 判断标准 | 典型信号 |
|------|---------|---------|
| 重复性错误 | 同一错误 >3 次 | npm 连接超时 ×11 |
| 间歇性失败 | 同一请求有时成功有时失败 | API 返回大小不一致 |
| 级联错误 | A 失败导致 B 也失败 | 第一个报错是根因 |
| 环境问题 | 错误与网络/权限/路径相关 | ECONNREFUSED, EACCES |
| 代码逻辑错误 | 堆栈指向具体代码行 | ImportError, SyntaxError |

### 4. 输出诊断报告

```
## 日志诊断报告

**扫描范围**: {目录/文件}
**发现日志**: N 个文件

### 发现 1: {错误类型}
- 出现次数: N 次
- 时间范围: {开始} ~ {结束}
- 根因判断: {一句话}
- 修复建议: {具体步骤}

### 发现 2: ...
```

### 5. 归档/清理
- 分析完成后询问是否归档（移动到 `logs-archive/`）或删除
- 建议将频繁产生调试日志的文件模式加入 `.gitignore`

## 关联技能
- 诊断出问题后，交给 `closure-check` 去验证修复是否生效
- 问题状态更新到 `project-tracker` 看板
