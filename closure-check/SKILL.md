---
name: closure-check
description: Use whenever the user claims a task/feature/fix is "done" or "finished", or says things like "跑一下", "验证", "测试", "check", "试运行", "能跑吗". Also use proactively after writing a non-trivial code module — the default assumption is that code hasn't been verified until this skill runs. Core principle: 写完≠完成，跑通=完成.
---

# 代码闭环验证

## 为什么需要这个技能

过去两天反复出现同一个反模式：代码写完了就标记完成，但从未被真正运行过。

- supreme-waffle: WebUI 120行代码、SoulBrain 引擎、技能加载器全部写完 → **从未启动过**
- ComfyUI: API 调了两次，响应异常（1.4MB vs 784B）→ **无人跟进分析**
- 多个脚本（fix-network, fix-git）写完 → **不确定是否真正解决了问题**

这不是技术问题，是流程问题。**写完代码和验证代码之间的间隙是 bug 的滋生地。** 这个技能强制填补这个间隙。

## 核心原则

> 写完 ≠ 完成。跑通 = 完成。

任何声称"完成"但没有验证证据的模块，都视为**未完成**。

## 执行流程

### 第一步：确定验证方式
根据模块类型选择：

| 模块类型 | 验证方式 |
|---------|---------|
| Web 服务 | 启动 → curl 请求 → 检查 HTTP 状态码和响应体 |
| CLI 脚本 | 用真实参数运行 → 检查退出码和输出 |
| API 调用 | 发送请求 → 检查响应 → 对比预期 |
| 配置文件 | 检查格式 → 确认被加载 → 验证行为生效 |
| 修复类脚本 | 复现原问题 → 确认问题不再出现 |

### 第二步：执行验证
1. 启动/运行目标
2. 发送测试输入
3. 收集输出（stdout/stderr/HTTP响应/日志）
4. 判断通过/失败

### 第三步：记录结果
- **通过**: 标记 `✅ verified`，记录验证命令和输出摘要
- **失败**: 标记 `🔴 blocked`，自动执行以下操作：
  1. 截取最近 50 行错误日志
  2. 判断错误类型（网络超时/权限拒绝/依赖缺失/代码逻辑/配置错误）
  3. 给出初步修复方向
  4. 写入 `D:\deepseek\daily-reports\verification-failures.md`

### 第四步：更新项目状态
将验证结果同步到项目状态文件。

## 反模式警告

以下说法全是未完成的信号，听到后必须触发验证：
- "应该能跑" → 没跑过
- "等会儿再测" → 大概率永远不会测
- "代码没问题" → 没有运行时证据
- "我试过了应该OK" → 需要看实际输出

## 输出格式

```
## 闭环验证 — {模块名}

**验证方式**: {启动+curl / 脚本执行 / API调用}
**结果**: ✅ 通过 / 🔴 失败
**证据**: {命令+输出摘要}
**下一步**: {通过则标记done / 失败则给出修复方向}
```
