# Runbook — Service Unreachable

> Template — replace REPLACE-ME with your service name.
> Full runbook template: willdesign-rules/development/runbook-template.md

**Service:** REPLACE-ME
**Severity:** SEV2 (staging) / SEV1 (prod)
**Owner:** Senior Dev team

## Quick Checks

```bash
# ECS service health
aws ecs describe-services \
  --cluster wilreji-{env}-cluster \
  --services REPLACE-ME \
  --region ap-northeast-1 \
  --query 'services[0].{running:runningCount,desired:desiredCount,events:events[0:3]}'

# Recent logs
aws logs tail /wilreji/{env}/REPLACE-ME --since 30m --region ap-northeast-1
```

## Common Causes (check in order)

1. SSM secret missing — container exits at startup.
2. ECR image pull failure — check ECS events for `CannotPullContainerError`.
3. Atlas allowlist — NAT EIPs may have changed after an infra apply.
4. Circuit breaker tripped — redeploy after fixing root cause.

## Rollback

```bash
gh workflow run deploy-{env}.yml \
  --repo WiLLDesignTech/REPLACE-ME \
  --ref staging \
  -f ref=<last-known-good-tag>
```

## Escalation

Senior dev on-call → Owner (prod SEV1 unresolved in 30 min).
