📋 Task: UX Optimization & New Trade Flow Implementation
Status: In Progress
Started: 2026-02-01
Goal: Implement complete trade flow with timeouts and optimized UX

Phase 1: Documentation Updates
Create
IMPLEMENTATION_PLAN_UX_OPTIMIZATION.md
Update
Clod/6_SecretBox_Rules_Mechanics.md
with new timeout rules
Update
Clod/9_Backend_Project_Document.md
with smart contract changes
Update
KEY_DISTRIBUTION_SOLUTIONS.md

- mark as final decision
  Update
  FINAL_PROPOSAL.md
- add implementation status
  Archive
  PRE_ENCRYPTION_ARCHITECTURE.md
  and
  SECURITY_ANALYSIS_3A.md
  Phase 2: Smart Contract Changes
  Core Struct & Constants
  Add locked_at: Option<u64> to GiftBox struct
  Add STATE_EXPIRED: u8 = 5 constant
  Add REVEAL_TIMEOUT_MS: u64 = 259200000 (72h)
  Update FINALIZE_TIMEOUT_MS from 24h to 72h
  Functions to Modify
  Update join_box() - set locked_at timestamp
  Update reveal_key() - ensure reveal_timestamp is set
  Restrict cancel_box() - only allow in OPEN state
  Update claim_auto_finalize() - change from 24h to 72h
  New Functions
  Implement claim_reveal_timeout() - buyer refund if seller doesn't reveal
  Add compensation logic (50% to buyer, 50% BURN)
  Add new event BoxExpired
  Testing
  Test claim_reveal_timeout() at 72h
  Test claim_reveal_timeout() before 72h (should fail)
  Test claim_auto_finalize() at 72h after reveal
  Test cancel_box() in LOCKED state (should fail)
  Test compensation calculation
  Phase 3: Frontend - Core Logic
  Hooks & Context
  Update
  useGiftBlitz.ts
- add claimRevealTimeout() function
  Update
  useGiftBlitz.ts
- restrict cancelBox() to OPEN state
  Add countdown timer utilities
  Add auto-polling logic for key reveal detection
  Update box state management for EXPIRED state
  Utils
  Create timeoutUtils.ts - calculate remaining time
  Create notificationUtils.ts - browser notifications
  Update
  security.ts
  if needed
  Phase 4: Frontend - UI Components
  New Components
  Create components/CountdownTimer.tsx
  Create components/PrePurchaseWarning.tsx
  Create components/VerificationGuide.tsx
  Create components/UrgentWarning.tsx
  Update Existing Pages
  Update
  pages/TradeDetail.tsx
  :
  Add countdown timers
  Add auto-polling for reveal
  Add urgent warnings
  Add claim timeout button
  Add verification guide
  Remove cancel button for LOCKED state
  Update
  pages/PurchaseBox.tsx
  :
  Add pre-purchase warning modal
  Show 72h verification requirement
  Update
  pages/Profile.tsx
  :
  Show urgent actions for sellers
  Show pending reveals with countdown
  Update
  pages/CreateBox.tsx
  :
  Add double confirmation
  Add preview before publish
  Warn about no cancellation after join
  Styling
  Add CSS for countdown timers
  Add CSS for urgent warnings
  Add CSS for verification guide
  Add animations for countdowns
  Phase 5: Testing & QA
  Smart Contract Tests
  Happy path (seller reveals, buyer confirms)
  Seller ghosting (doesn't reveal in 72h)
  Buyer ghosting (doesn't confirm in 72h - auto-finalize)
  Dispute flow
  Edge case: exactly at timeout
  Edge case: cancel in OPEN vs LOCKED
  Frontend Tests
  Countdown timers display correctly
  Auto-polling detects reveal
  Pre-purchase warning shows
  Verification guide shows correct steps
  Browser notifications work
  Urgent warnings appear at < 24h
  Claim timeout button appears after 72h
  Cancel button hidden in LOCKED state
  Integration Tests
  End-to-end happy path
  End-to-end timeout scenarios
  Mobile responsive
  Cross-browser compatibility
  Phase 6: Deployment
  Deploy updated smart contract to testnet
  Test on testnet with real transactions
  Update frontend environment variables
  Deploy frontend to staging
  Final QA on staging
  Deploy to production
  Monitor for issues
  Notes & Decisions
  Key Decisions Made:
  ✅ NO cancellation after buyer joins
  ✅ 72h reveal timeout (seller must reveal or buyer gets refund)
  ✅ 72h auto-finalize (buyer must verify or trade auto-completes)
  ✅ 50% seller stake to buyer as compensation (50% BURN)
  ✅ Symmetric timeouts (both 72h for fairness)
  Risks & Mitigations:
  Risk: Buyer doesn't verify in 72h, gets invalid code
  Mitigation: Very clear UI warnings, countdown timers, notifications
  Risk: Seller has legitimate emergency, can't reveal in 72h
  Mitigation: 72h is generous (covers weekend), clear warning when creating box
  Risk: Confusion about auto-finalize
  Mitigation: Multiple warnings, verification guide, step-by-step instructions
  Progress Summary
  Completed: 2/40 tasks (5%) In Progress: Documentation phase Next: Smart contract implementation

Estimated Time Remaining: 3-4 days

Comment
Ctrl+Alt+M
