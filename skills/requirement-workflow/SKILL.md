# Requirement Workflow

Reusable patterns and techniques for effective requirements engineering. Use these patterns when eliciting, analyzing, and documenting product requirements.

## When to Use

- Starting a new project or feature
- Requirements feel vague or incomplete
- Stakeholders have conflicting understandings
- Need to validate scope before committing resources
- Transitioning from discovery to implementation
- Need to understand existing solutions before designing new ones

## Requirements Elicitation Techniques

### The 5 Ws Framework

| Question | Purpose | Example Answers |
|----------|---------|-----------------|
| **Who** | Identify users/personas | "Admin users", "Mobile customers", "API integrators" |
| **What** | Define functionality | "Export reports", "Reset password", "Sync data" |
| **Why** | Understand motivation | "Compliance requirement", "Reduce churn", "Competitor parity" |
| **When** | Set timeline/milestones | "End of quarter", "Before Black Friday", "ASAP" |
| **Constraints** | Surface limitations | "Must use existing auth", "$10K budget", "GDPR compliant" |

### Progressive Disclosure

Don't overwhelm users with questions. Start small, offer depth:

1. **Phase 1: Core** (Always) - 3 essential questions
2. **Phase 2: Extended** (Offer) - Timeline, constraints, scope
3. **Phase 3: Edge Cases** (Deep dive) - Error scenarios, limits

### Active Listening Patterns

When a user states a requirement, probe deeper:

| User Says | Probe With | Goal |
|-----------|------------|------|
| "Make it fast" | "What's the target response time?" | Get specific metrics |
| "Users should be able to..." | "Which users specifically?" | Identify personas |
| "Support all browsers" | "Any specific versions we must support?" | Define scope |
| "Easy to use" | "What tasks should be doable in < 3 clicks?" | Operationalize UX |

## Research Phase

Research during requirements gathering is crucial for informed decision-making.

### Research Objectives

1. **Discover existing solutions** — What similar features exist in your codebase?
2. **Identify patterns** — What are common approaches for this type of feature?
3. **Evaluate technologies** — What libraries, tools, or services should be considered?
4. **Understand constraints** — What technical or business limitations exist?
5. **Learn from others** — What are industry best practices and common pitfalls?

### Research Methods

| Method | Tools | When to Use |
|--------|-------|-------------|
| **Codebase Exploration** | `Read`, `Grep`, `Glob` | Finding existing implementations |
| **Documentation Review** | Web fetch, README files | Understanding APIs and libraries |
| **Competitive Analysis** | Web search | Learning from similar products |
| **Pattern Research** | GitHub search, blogs | Finding proven approaches |

### Research Checklist

Before finalizing requirements, research:

- [ ] **Existing Codebase** — Are there similar features already implemented?
- [ ] **Patterns** — What architectural patterns fit this feature?
- [ ] **Libraries** — Are there battle-tested libraries we should use?
- [ ] **Integration Points** — What systems will this feature interact with?
- [ ] **Performance** — What are typical performance benchmarks for this type of feature?
- [ ] **Security** — Are there known security considerations?
- [ ] **Compliance** — Any regulatory requirements (GDPR, HIPAA, etc.)?

### Documenting Research Findings

Include in your PRD:

```markdown
## 2. Research Findings

### 2.1 Existing Solutions
- **Current codebase**: Found auth system in `src/auth/` using JWT tokens
- **Similar products**: Competitor X uses session-based auth, Competitor Y uses OAuth only
- **Lessons learned**: Existing implementation lacks refresh token rotation

### 2.2 Technical Landscape
- **Options considered**:
  - Auth0: $$$ but full-featured
  - NextAuth.js: Free, good for Next.js
  - Custom JWT: More control, more maintenance
- **Recommended approach**: NextAuth.js for faster delivery

### 2.3 Further Research Needed
- [ ] Evaluate NextAuth.js vs custom solution with security team
- [ ] Confirm OAuth provider requirements with product team
- [ ] Research rate limiting strategies for auth endpoints
```

## User Story Templates

### Standard Format
```
As a [user type], I want [goal], so that [benefit].
```

### With Acceptance Criteria
```
As a [user type], I want [goal], so that [benefit].

**Acceptance Criteria:**
- [ ] Criterion 1 (given/when/then or specific condition)
- [ ] Criterion 2
- [ ] Criterion 3

**Priority:** Must-have / Should-have / Nice-to-have
**Estimate:** Small / Medium / Large
```

### Common User Story Patterns

| Pattern | Example |
|---------|---------|
| **Authentication** | As a user, I want to log in with my email, so that I can access my account securely. |
| **Data Entry** | As an admin, I want to bulk upload users via CSV, so that I don't have to add them one by one. |
| **Notification** | As a customer, I want to receive email alerts when my order ships, so that I know when to expect delivery. |
| **Reporting** | As a manager, I want to see daily sales reports, so that I can track team performance. |
| **Integration** | As a developer, I want REST API access, so that I can integrate with our internal tools. |

## Acceptance Criteria Patterns

### Given/When/Then (BDD Style)
```
Given [precondition]
When [action]
Then [expected result]
```

Example:
```
Given a user is on the login page
When they enter valid credentials
Then they are redirected to the dashboard
And their session token is stored
```

### Checklist Style
```
- [ ] User can enter email and password
- [ ] System validates credentials against database
- [ ] Invalid credentials show error message "Invalid email or password"
- [ ] Successful login redirects to /dashboard
- [ ] Session expires after 24 hours of inactivity
```

### Constraint Style
```
- [ ] Response time < 200ms for 95th percentile
- [ ] Supports 10,000 concurrent users
- [ ] Works on Chrome, Firefox, Safari (last 2 versions)
- [ ] Complies with WCAG 2.1 AA accessibility standards
```

## Constraint Categorization

### Technical Constraints
| Category | Examples |
|----------|----------|
| **Platform** | "Must run on iOS 14+", "Serverless architecture only" |
| **Integration** | "Must use existing Salesforce connection", "Stripe for payments" |
| **Performance** | "Page load < 3s", "API latency < 100ms" |
| **Security** | "SOC2 compliant", "Data must stay in EU" |

### Business Constraints
| Category | Examples |
|----------|----------|
| **Budget** | "$50K max", "Use existing licenses" |
| **Timeline** | "Before holiday season", "End of quarter" |
| **Resources** | "Only 2 developers available", "No design support" |
| **Compliance** | "GDPR compliant", "HIPAA required" |

### User Constraints
| Category | Examples |
|----------|----------|
| **Accessibility** | "WCAG 2.1 AA", "Screen reader compatible" |
| **Localization** | "Support 12 languages", "RTL layouts" |
| **Device** | "Works on 320px width", "Touch-friendly" |

## PRD Templates

### Full PRD Template
```markdown
# PRD: [Feature Name]

## 1. Overview
[2-3 sentence summary of what we're building and why]

## 2. Research Findings (Optional but Recommended)
### 2.1 Existing Solutions
- [What similar solutions exist?]
- [What can we learn from them?]

### 2.2 Technical Landscape
- [Relevant technologies, libraries, patterns]
- [Known limitations or trade-offs]

### 2.3 Further Research Needed
- [ ] Research topic 1 (why needed, who should do it)
- [ ] Research topic 2

## 3. Goals & Success Criteria
- **Goal 1**: [description]
- **Goal 2**: [description]
- **Success Metrics**: [quantitative measures]

## 4. User Stories
### Story 1: [Name]
As a [user type], I want [goal], so that [benefit].

**Acceptance Criteria:**
- [ ] Criterion 1
- [ ] Criterion 2

**Priority:** [Must/Should/Could]

### Story 2: [Name]
...

## 5. Functional Requirements
- FR1: [Specific, testable requirement]
- FR2: [Specific, testable requirement]

## 6. Non-Functional Requirements
- **Performance**: [requirements]
- **Security**: [requirements]
- **Reliability**: [requirements]
- **UX**: [requirements]

## 7. Constraints & Assumptions
### Constraints
- [limitation 1]
- [limitation 2]

### Assumptions
- [assumption 1]
- [assumption 2]

## 8. Open Questions
- [Question 1] — [who will answer / by when]

## 9. Suggested Next Step
- `/plan` — Create implementation plan
- `/tdd` — Start test-driven development
```

### Quick PRD Template (Simple Features)
```markdown
# PRD: [Feature Name]

## Overview
[1-2 sentences]

## Requirements
- [ ] Requirement 1
- [ ] Requirement 2
- [ ] Requirement 3

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Next Step
- `/plan` or `/tdd`
```

## Red Flags Checklist

Watch for these warning signs during requirements gathering:

- [ ] Vague terms: "user-friendly", "fast", "easy", "intuitive"
- [ ] No success metrics defined
- [ ] Missing user context (who is this for?)
- [ ] Unstated assumptions
- [ ] Scope creep indicators ("and also...", "what if we added...")
- [ ] Conflicting requirements
- [ ] No timeline or milestones
- [ ] Missing error scenarios
- [ ] No constraints identified
- [ ] Solution disguised as requirement ("Use React for the frontend")

## Quality Checklist

Before finalizing a PRD, verify:

### Content Quality
- [ ] Every requirement is specific and unambiguous
- [ ] Every user story has clear acceptance criteria
- [ ] Success criteria are measurable
- [ ] Constraints are documented
- [ ] Edge cases are considered
- [ ] Priority is assigned to each story
- [ ] Dependencies are identified
- [ ] Open questions have owners

### Research Quality
- [ ] Existing codebase explored for similar features
- [ ] Industry patterns and best practices considered
- [ ] Technical options evaluated with trade-offs
- [ ] Further research topics identified if needed
- [ ] Stakeholders have reviewed and agreed

## Examples

### Example 1: Authentication System

```markdown
# PRD: User Authentication

## 1. Overview
Implement secure email/password authentication with optional social login
to replace the current insecure system flagged by security audit.

## 2. Research Findings

### 2.1 Existing Solutions
- **Current system**: Basic session-based auth in `src/auth/`, lacks rate limiting
- **Industry standard**: JWT with refresh token rotation
- **Competitor analysis**: Most use OAuth-first with email/password fallback

### 2.2 Technical Landscape
- **Options evaluated**:
  - Auth0: Enterprise-grade, $$$, quick to implement
  - NextAuth.js: Free, Next.js native, good community
  - Custom JWT: Full control, higher maintenance burden
- **Recommended**: NextAuth.js for balance of speed and flexibility

### 2.3 Further Research Needed
- [ ] Confirm OAuth providers with product team (Google? GitHub? Others?)
- [ ] Review security team's requirements for token expiration
- [ ] Evaluate need for MFA/2FA

## 3. Goals
- Pass security audit requirements
- Reduce account takeover incidents by 90%
- Maintain < 200ms login response time

## 4. User Stories
### Story 1: Email/Password Registration
As a new customer, I want to register with email and password, so that I
can create an account without third-party dependencies.

**Acceptance Criteria:**
- [ ] Email must be valid format (RFC 5322)
- [ ] Password minimum 12 characters
- [ ] Password must include uppercase, lowercase, number, symbol
- [ ] Duplicate emails rejected with "Account already exists"
- [ ] Verification email sent within 30 seconds
- [ ] Account inactive until email verified

**Priority:** Must-have

### Story 2: Social Login
As a customer, I want to sign in with my Google account, so that I don't
need to remember another password.

**Acceptance Criteria:**
- [ ] Google OAuth 2.0 integration
- [ ] New accounts created automatically on first login
- [ ] Existing accounts can link Google auth
- [ ] Unlink option in account settings

**Priority:** Should-have

## 5. Constraints
- Must integrate with existing user database
- Passwords must be hashed with bcrypt (cost factor 12)
- GDPR compliant data handling
- $5K budget for auth service
```

### Example 2: Simple Feature

```markdown
# PRD: Dark Mode Toggle

## Overview
Add dark mode toggle in user settings with system preference detection
and instant theme switching.

## Research Findings
- **Existing**: No current theming system in codebase
- **Patterns**: CSS variables + data attribute approach is standard
- **Libraries**: Tailwind CSS has built-in dark mode support (we already use Tailwind)
- **Implementation**: Use `darkMode: 'class'` in Tailwind config

## Requirements
- [ ] Toggle in /settings/appearance page
- [ ] Respect system `prefers-color-scheme` by default
- [ ] Persist user choice in localStorage
- [ ] Apply theme without page reload
- [ ] Smooth transition between themes (300ms)

## Acceptance Criteria
- [ ] Toggle switches between light/dark/system options
- [ ] User choice persists across sessions
- [ ] No flash of wrong theme on page load
- [ ] Works on Chrome, Firefox, Safari (latest 2 versions)
- [ ] Passes WCAG contrast requirements in both themes

## Next Step
- `/tdd` — Start with theme context tests
```

## Related Resources

- `/req` command — Invoke requirements analysis
- `/plan` command — Create implementation plan from PRD
- `/tdd` command — Start development with tests

## References

- [INVEST criteria](https://www.agilealliance.org/glossary/invest/) for user stories
- [Given/When/Then pattern](https://martinfowler.com/bliki/GivenWhenThen.html)
- [Google Docs PRD Template](https://www.productplan.com/glossary/product-requirements-document/)
