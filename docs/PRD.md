# Product Requirements Document (PRD)

## 1. Product Summary
**Product name:** AInspire (working)

AInspire is a visual preference-learning platform for artists and creative teams. Users do not need to write prompts. They train the system through fast visual feedback (like/dislike/save/this-or-that/attribute feedback), and the platform produces inspiration boards, style packs, and usable generated artwork.

## 2. Problem Statement
Most image-generation tools are prompt-first and require users to convert visual taste into text. This is slow, inconsistent, and often inaccessible for non-technical creators.

## 3. Vision
Create the default "taste-first" creative operating system where users can discover and refine aesthetic direction with minimal typing.

## 4. Goals (Phase 1: 12 weeks)
1. Validate that users can reach high-quality outputs through visual interactions.
2. Build a measurable recommendation loop that improves in-session quality.
3. Deliver enterprise-safe workflows with basic auditability and moderation.

## 5. Non-Goals (Phase 1)
- Custom model training per enterprise tenant.
- Mobile-native apps.
- Fully automated campaign generation.
- Advanced legal hold automation.

## 6. Personas
1. **Independent Artist**: wants visual inspiration and quick style exploration.
2. **Creative Director**: wants controlled style packs for campaign alignment.
3. **Design Team Lead**: wants reusable style IDs and team-level boards.
4. **Enterprise Admin**: needs tenant isolation, audit logs, SSO readiness.

## 7. User Journey
### Step 1: Artifact Selection
Supported artifact types:
- poster
- tattoo
- logo
- painting
- storyboard
- UI design
- album cover
- game concept art
- illustration
- brand identity

### Step 2: Style Priming
User selects optional vibe chips:
- minimal, surreal, retro, editorial, cinematic, anime, brutalist, luxury, gothic, psychedelic

### Step 3: Visual Preference Loop
User sees 10 cards and can:
- like, dislike, save
- this-or-that
- more-like-this, less-like-this
- attribute-level feedback (palette, composition, linework, texture, realism, typography)

### Step 4: Iterative Feed
System reranks feed with:
- taste similarity
- artifact match
- diversity and novelty
- fatigue suppression

### Step 5: Generation Gate
Trigger final generation when:
- `saved_images >= 5`
- `interactions >= 20`

Output set:
- 4 safe-adjacent
- 2 creative stretch
- 2 wildcard

### Step 6: Final Outputs
- Inspiration board
- Editable variations
- Style pack (palette, typography, texture, layout pattern, prompt abstraction, style ID)

## 8. Functional Requirements
### Must Have
- Session creation with artifact + vibe chips
- Feed retrieval with top-10 ranked images
- Preference capture API for all interaction types
- Board creation and save flow
- Generation orchestration with moderation and cost tracking
- Style pack generation endpoint
- Basic tenant boundaries and audit logs

### Should Have
- Attribute-specific feedback controls
- A/B test support for reranker weights
- Explainability metadata on why an image appears

### Could Have
- Team-shared style packs
- Prompt export compatibility

## 9. Success Metrics
- Session completion rate
- Time to first save
- Saves per session
- Return rate (D7, D30)
- Reranker lift (save rate vs baseline)
- Generation success rate
- Moderation rejection rates

## 10. Constraints & Risks
- Copyright/IP and artist-style mimicry concerns
- Safety moderation false negatives/positives
- Cost explosion from uncontrolled generation volume
- Cold-start quality before sufficient interaction data

## 11. Compliance and Safety
- NSFW / violence / hate filtering
- Copyrighted character and likeness checks
- Manual review queue for flagged outputs
- Data retention + deletion policy
- Consent flags at user level

## 12. Pricing (initial)
- **Free**: limited sessions, low-res export
- **Creator**: $20/month, unlimited sessions, HD exports, style packs
- **Enterprise**: $40–80/seat, SSO, admin dashboard, audit logs, brand controls

## 13. Release Criteria
- End-to-end flow from session start to style pack export works at P95 latency budget
- Moderation coverage enabled for all generation routes
- Audit events emitted for generation/save/export actions
- Baseline reranker produces positive lift over random feed
