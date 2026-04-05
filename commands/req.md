---
description: Clarify and document requirements before coding. Transforms vague ideas into structured PRDs. DOES NOT execute - only generates documentation.
---

# Req Command

Transforms vague feature ideas into clear, structured Product Requirements Documents (PRDs). **This command ONLY generates documentation and NEVER executes code or plans.**

## ⚠️ Important

**`/req` only generates PRD documents. It does NOT:**
- Create implementation plans (use `/plan` for that)
- Write any code (use `/tdd` for that)
- Execute any actions

After `/req` completes, you must **manually** run `/plan` to continue.

## What This Command Does

1. **Clarifies Requirements** - Guides you through structured questioning
2. **Conducts Research** - Investigates existing codebase, patterns, and solutions
3. **Structures Thinking** - Breaks down high-level needs into specific features
4. **Documents PRD** - Generates standardized Google Docs style PRD with research findings

## When to Use

Use `/req` when:
- You have a vague idea but aren't sure of the specifics
- Requirements exist only in your head
- Stakeholders have conflicting understandings
- You need to validate scope before estimating effort
- Preparing documentation for team alignment

**Skip `/req`** and go directly to `/plan` if:
- Requirements are already well-documented
- This is a simple bug fix or one-line change
- You've already discussed details with stakeholders

## Workflow

```
User: /req I need to add user authentication

Agent: Great! Let's clarify your requirements...
[Questions and research]

Agent: Here's your PRD:

# PRD: User Authentication System
...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ PRD 生成完成！

📄 已保存至：.claude/reqs/20250406-user-auth-system.md

下一步（请手动执行）：
→ 运行 /plan 创建实现规划
→ 或修改需求后继续
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[AGENT STOPS HERE - No automatic execution]
```

## PRD 自动保存

生成的 PRD 将自动保存到项目目录：

**保存路径：** `.claude/reqs/YYYYMMDD-feature-name.md`

**文件名规则：**
- 日期前缀：当前日期（YYYYMMDD）
- 功能名称：从需求中提取的核心功能关键词
- 示例：`20250406-user-auth-system.md`

**好处：**
- 自动归档所有需求文档
- 便于后续查阅和管理
- 与代码变更历史对应

## PRD Output Format

The generated PRD follows Google Docs style with these sections:

1. **Overview** - 2-3 sentence summary
2. **Research Findings** - Existing solutions, technical landscape, further research needed (optional but recommended)
3. **Goals & Success Criteria** - Measurable objectives
4. **User Stories** - As a [user], I want [goal], so that [benefit]
5. **Functional Requirements** - Specific capabilities
6. **Non-Functional Requirements** - Performance, security, UX
7. **Constraints & Assumptions** - Limitations and prerequisites
8. **Open Questions** - Items to resolve
9. **Next Step** - Reference to `/plan`

## Example Usage

### Scenario 1: Vague Feature Idea

```
User: /req I need to add user authentication

Agent: Great! Let's clarify your requirements. A few questions:

1. Who are the target users? (e.g., customers, admins, both?)
2. What authentication methods? (email/password, social login, SSO?)
3. Why is this needed now? (security requirement, new feature, compliance?)

User: Customers only, email/password with Google OAuth option. 
Security audit flagged our current system.

Agent: Got it. Would you like deeper analysis on constraints and edge cases?

User: Yes

[Extended questioning about sessions, password policies, 2FA, etc.]

Agent: Here's your PRD:

# PRD: User Authentication System

## 1. Overview
Add secure email/password authentication with optional Google OAuth 
for customer accounts to address security audit findings.

## 2. Goals & Success Criteria
- Pass security audit requirements
- Support 10,000 concurrent sessions
- < 200ms login response time

## 3. User Stories
...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ PRD 生成完成！

下一步（请手动执行）：
→ 运行 /plan 创建实现规划
→ 或修改需求后继续
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Scenario 2: Well-Understood Feature

```
User: /req Add dark mode toggle to settings page

Agent: This seems like a simple feature. Quick questions:

1. Who needs this? (all users or specific plan?)
2. Should it respect system preference by default?
3. Any timeline pressure?

User: All users, yes respect system default, no rush

Agent: Got it. Generating quick PRD...

# PRD: Dark Mode Toggle

## Overview
Add dark mode toggle in settings with system preference detection.

## Requirements
- [ ] Toggle in /settings/appearance
- [ ] Respect system preference by default
- [ ] Persist user choice in localStorage
- [ ] Apply theme without page reload

## Acceptance Criteria
...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ PRD 生成完成！

下一步（请手动执行）：
→ 运行 /plan 创建实现规划
→ 或修改需求后继续
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Quick Mode

For simple features (< 1 day effort), the agent generates an abbreviated PRD:

```markdown
# PRD: [Simple Feature]

## Overview
[1-2 sentences]

## Requirements
- [ ] Requirement 1
- [ ] Requirement 2

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Next Step
Run `/plan` to create implementation plan
```

## Integration with Other Commands

After `/req` generates the PRD:
1. **Review the PRD** - Ensure it captures your requirements
2. **Run `/plan`** - Create implementation plan from the PRD
3. **Run `/tdd`** - Start test-driven development (after planning)

**Important**: You must manually run these commands. `/req` will NOT automatically invoke them.

## Tips for Best Results

1. **Be honest about uncertainty** - If you're not sure about something, say so
2. **Answer questions thoroughly** - More context = better PRD
3. **Challenge assumptions** - The agent will question things that seem unclear
4. **Iterate** - It's okay to refine the PRD multiple times
5. **Review before planning** - Make sure the PRD is complete before running `/plan`

## Related Agents

This command invokes the `requirement-analyst` agent.

For manual installs, the source file lives at:
`agents/requirement-analyst.md`
