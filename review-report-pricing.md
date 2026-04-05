# Code Review Report

## Scope

Reviewed change:

- `src/app/(marketing)/pricing/page.tsx`

## Findings

### 1. [P2] Plan selection is mouse-only and inaccessible to keyboard/screen-reader users

- File: `src/app/(marketing)/pricing/page.tsx:162`
- Severity: Medium

#### Problem

The pricing cards now use `onClick` on plain `div` elements to update `selectedPlan`.
Because these elements do not expose button/radio semantics, do not have `tabIndex`,
and do not implement keyboard interaction, keyboard users cannot change the selected
plan.

Screen readers also do not get a reliable selected-state announcement.

#### Why this matters

This is not only a visual/accessibility polish issue. The new `selectedPlan` state
changes real page behavior:

- shader focus position
- selected card styling
- CTA visual emphasis

As a result, non-pointer users lose access to the page's core plan-selection interaction.

#### Recommended fix

Use an accessible interactive pattern instead of clickable `div` elements. Good options:

1. Replace each card with a semantic `button`
2. Or model the cards as a proper radio group

At minimum:

- add keyboard operability
- expose selected state with ARIA
- ensure focus visibility

## Verification Notes

- `next lint` did not run correctly in this environment because the current script
  resolved to:
  `Invalid project directory provided, no such directory: ...\\recoverly\\lint`
- File-level verification was performed with:
  `npx eslint "src/app/(marketing)/pricing/page.tsx"`
- That file-level ESLint check passed

## Summary

One meaningful regression was found in the reviewed change set:

- keyboard and assistive-technology users can no longer select pricing plans
