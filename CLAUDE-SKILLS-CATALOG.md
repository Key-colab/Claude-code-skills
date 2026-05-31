# Claude Code 完整技能与组件目录

> 自动生成 | 总计: 54 全局技能 + 249 ECC技能 + 63 ECC Agent + 79 ECC命令

## 一、全局技能 (54个)

存放位置: `~/.claude/skills/`

### AI/Agent 开发
| 技能名 | 描述 |
|---------|------|
| agent-browser-automation | Headless browser automation CLI for AI agents using native Rust binary with Chrome DevTools Protocol |
| claude-api | Build, debug, and optimize Claude API / Anthropic SDK apps |
| claude-md-improver | Audit and improve CLAUDE.md files in repositories |
| find-skills | Helps users discover and install agent skills |
| skill-creator | Create new skills, modify and improve existing skills, measure skill performance |
| skill-development | Skill development best practices for Claude Code plugins |
| subagent-driven-development | Execute implementation plans with independent tasks in the current session |
| task-coordination-strategies | Decompose complex tasks, design dependency graphs, coordinate multi-agent work |

### 前端开发
| 技能名 | 描述 |
|---------|------|
| frontend-design | Create distinctive, production-grade frontend interfaces with high design quality |
| modern-javascript-patterns | Master ES6+ features including async/await, destructuring, modules, iterators, generators |
| react-state-management | Modern React state management with Redux Toolkit, Zustand, Jotai, and React Query |
| typescript-advanced-types | Master TypeScript's advanced type system |
| ui-ux-pro-max | UI/UX design system with 67 styles, 95 color palettes, 57 font pairings |

### 后端开发
| 技能名 | 描述 |
|---------|------|
| api-design | REST API design patterns including resource naming, pagination, filtering, error responses |
| backend-patterns | Backend architecture patterns, API design, database optimization, server-side best practices |
| go-concurrency-patterns | Master Go concurrency with goroutines, channels, sync primitives, and context |
| golang-patterns | Idiomatic Go patterns, best practices, and conventions |
| nodejs-backend-patterns | Build production-ready Node.js backend services with Express/Fastify |
| python-patterns | Pythonic idioms, PEP 8 standards, type hints, and best practices |
| python-error-handling | Python error handling patterns including input validation, exception hierarchies |
| python-type-safety | Python type safety with type hints, generics, protocols, strict type checking |
| async-python-patterns | Master Python asyncio, concurrent programming, and async/await patterns |

### 数据库
| 技能名 | 描述 |
|---------|------|
| database-migration | Execute database migrations across ORMs with zero-downtime strategies |
| postgres-patterns | PostgreSQL patterns for query optimization, schema design, indexing, security |
| sql-optimization-patterns | SQL query optimization, indexing strategies, and EXPLAIN analysis |

### 测试
| 技能名 | 描述 |
|---------|------|
| e2e-testing | Playwright E2E testing patterns, Page Object Model, CI/CD integration |
| golang-testing | Go testing patterns including table-driven tests, subtests, benchmarks, fuzzing |
| python-testing | Python testing strategies using pytest, TDD methodology, fixtures, mocking |
| tdd | Test-driven development - use before writing implementation code |
| verify | Verification before claiming work is complete |

### DevOps/CI
| 技能名 | 描述 |
|---------|------|
| bash-defensive-patterns | Master defensive Bash programming techniques for production-grade scripts |
| deployment-patterns | Deployment workflows, CI/CD pipeline patterns, Docker containerization |
| github-actions-templates | Production-ready GitHub Actions workflows for CI/CD |

### 安全
| 技能名 | 描述 |
|---------|------|
| secrets-management | Secure secrets management for CI/CD using Vault, AWS Secrets Manager |
| security-review | Comprehensive security checklist for auth, user input, secrets, API endpoints |

### 工具/实用
| 技能名 | 描述 |
|---------|------|
| analyze | Non-destructive cross-artifact consistency and quality analysis |
| architecture-decision-records | Write and maintain ADRs following best practices |
| clarify | Identify underspecified areas by asking up to 5 clarification questions |
| code-review-excellence | Master effective code review practices |
| debug | Systematic debugging workflow |
| error-handling-patterns | Error handling patterns across languages |
| git-advanced-workflows | Advanced Git workflows: rebasing, cherry-picking, bisect, worktrees, reflog |
| grill-me | Intensive code review questioning session |
| log-analyzer | Scan log files, extract key errors, identify patterns, give diagnosis |
| pr-create | Create PR from changes, monitor CI, debug failures until CI passes |
| pr-threads-address | Review unresolved PR threads and address them |
| scan | Scan codebase to generate project-doc.md and AGENTS.md |
| search-first | Research-before-coding workflow |
| web-scraping | Web scraping with anti-bot bypass, content extraction |
| write-plan | Create implementation plan for multi-step tasks |
| python-code-style | Python code style, linting, formatting, naming conventions |

### 学习/优化
| 技能名 | 描述 |
|---------|------|
| karpathy-guidelines | Andrej Karpathy's AI coding behavior guidelines |
