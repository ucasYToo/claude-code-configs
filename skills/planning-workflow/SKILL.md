# Planning Workflow

Reusable patterns for creating effective implementation plans. Use these patterns when breaking down complex features into actionable steps.

## When to Use

- Starting a new feature or project
- Making architectural changes
- Planning complex refactoring
- Breaking down large tasks into manageable pieces
- Estimating effort and identifying risks

## Planning Principles

### 1. Start with Requirements
- Understand what needs to be built before planning how
- Clarify success criteria
- Identify constraints and assumptions

### 2. Think in Phases
- Break work into independently deliverable chunks
- Each phase should provide value on its own
- Avoid all-or-nothing plans

### 3. Be Specific
- Use exact file paths and function names
- Define clear inputs and outputs
- Specify expected behavior

### 4. Consider Dependencies
- Identify what must be done before what
- Note external dependencies (APIs, services, teams)
- Plan for integration points

## Plan Structure

### Standard Template

```markdown
# Implementation Plan: [Feature Name]

## Overview
[2-3 sentence summary of what we're building and why]

## Requirements Restatement
- [Requirement 1]
- [Requirement 2]
- [Success criteria]

## Architecture Changes
- [Change 1: file path and description]
- [Change 2: file path and description]

## Implementation Steps

### Phase 1: [Phase Name]
1. **[Step Name]** (File: path/to/file.ts)
   - Action: Specific action to take
   - Why: Reason for this step
   - Dependencies: None / Requires step X
   - Risk: Low/Medium/High

### Phase 2: [Phase Name]
...

## Testing Strategy
- Unit tests: [files to test]
- Integration tests: [flows to test]
- E2E tests: [user journeys to test]

## Risks & Mitigations
- **Risk**: [Description]
  - Mitigation: [How to address]

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2
```

## Phase Planning

### Phase Types

| Phase | Purpose | Example |
|-------|---------|---------|
| **Foundation** | Set up infrastructure | Database schema, config, utilities |
| **Core** | Implement main functionality | API endpoints, business logic |
| **Integration** | Connect components | Wire up frontend to backend |
| **Polish** | Error handling, edge cases | Validation, error messages |
| **Optimize** | Performance, monitoring | Caching, logging, metrics |

### Phase Sizing Guidelines

- **Small**: 1-2 files, < 2 hours
- **Medium**: 3-5 files, 2-4 hours
- **Large**: 6+ files, 4-8 hours (consider splitting)

Each phase should be:
- Independently reviewable
- Testable in isolation
- Mergeable without breaking main

## Risk Assessment

### Common Risk Categories

| Category | Examples | Mitigation |
|----------|----------|------------|
| **Technical** | New technology, complex algorithm | Spike/prototype first |
| **Integration** | Third-party APIs, external services | Mock interfaces early |
| **Performance** | Large data volumes, real-time | Benchmark early, optimize later |
| **Security** | Auth, sensitive data | Security review in each phase |
| **Dependency** | Blocked on other teams/features | Parallel work, fallback plans |

### Risk Register Template

```markdown
## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| API rate limits | Medium | High | Implement caching, backoff |
| Database migration fails | Low | High | Test on staging, backup first |
| Performance with 10k users | Medium | Medium | Load test in Phase 2 |
```

## Planning Checklist

Before finalizing a plan, verify:

- [ ] All requirements are addressed
- [ ] Each step has a clear file path
- [ ] Dependencies are identified
- [ ] Risks have mitigation strategies
- [ ] Testing approach is defined
- [ ] Phases can be delivered independently
- [ ] Success criteria are measurable
- [ ] Effort estimates are realistic

## Example Plan

```markdown
# Implementation Plan: Stripe Subscription Billing

## Overview
Add subscription billing with free/pro/enterprise tiers. Users upgrade via
Stripe Checkout, and webhook events keep subscription status in sync.

## Requirements
- Three tiers: Free (default), Pro ($29/mo), Enterprise ($99/mo)
- Stripe Checkout for payment flow
- Webhook handler for subscription lifecycle events
- Feature gating based on subscription tier

## Architecture Changes
- New table: `subscriptions` (user_id, stripe_customer_id, stripe_subscription_id, status, tier)
- New API route: `app/api/checkout/route.ts`
- New API route: `app/api/webhooks/stripe/route.ts`
- New middleware: check subscription tier
- New component: `PricingTable`

## Implementation Steps

### Phase 1: Database & Backend
1. **Create subscription migration**
   - File: `supabase/migrations/004_subscriptions.sql`
   - Dependencies: None
   - Risk: Low

2. **Create Stripe webhook handler**
   - File: `src/app/api/webhooks/stripe/route.ts`
   - Dependencies: Step 1
   - Risk: High — verify signature

### Phase 2: Checkout Flow
3. **Create checkout API route**
   - File: `src/app/api/checkout/route.ts`
   - Dependencies: Step 1
   - Risk: Medium

4. **Build pricing page**
   - File: `src/components/PricingTable.tsx`
   - Dependencies: Step 3
   - Risk: Low

## Testing Strategy
- Unit: Webhook parsing, tier checking
- Integration: Checkout session, webhook processing
- E2E: Full upgrade flow

## Risks & Mitigations
- **Risk**: Webhook events arrive out of order
  - Mitigation: Use timestamps, idempotent updates

## Success Criteria
- [ ] User can upgrade via Stripe Checkout
- [ ] Webhook syncs status correctly
- [ ] Free users blocked from Pro features
- [ ] 80%+ test coverage
```

## Related Resources

- `/plan` command — Create implementation plan
- `/req` command — Gather requirements first
- `/tdd` command — Execute plan with tests
