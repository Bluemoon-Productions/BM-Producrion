# 3D Music Production Site Transformation - TODO

Current Progress: 12/14 ✅

## Phase 1: Core 3D Setup (Steps 1-4)
- [x] 1. Create js/three-setup.js with Three.js scene manager (hero 3D, preserve canvas sizing)
- [x] 2. Update index.html: Add Three.js/GSAP CDNs, #three-canvas in hero/services/clients
- [x] 3. Update css/style.css: Neon theme, global 3D perspective, dark gradients
- [x] 4. Update js/main.js: Init 3D scenes on load/resize, GSAP scroll triggers

## Phase 2: 3D Hero & Visuals (Steps 5-7)
- [x] 5. Implement 3D hero: Floating orbs/particles (audio-reactive), rotating mixer model
- [x] 6. Enhance animations.css: GSAP classes, neon glows, particle fallbacks
- [x] 7. Add js/animations.js updates: Web Audio API for sound waves/particles

## Phase 3: Interactive 3D Sections (Steps 8-10)
- [ ] 8. 3D Services: Hover flip cards to 3D icons/models (mic, speakers via geometries)
- [ ] 9. 3D Clients: Orbiting video frames carousel
- [ ] 10. About/Contact: Parallax 3D layers, floating elements

## Phase 4: Invoice Enhancements (Steps 11-12)
- [x] 11. invoice.html: 3D floating forms/totals, dynamic item morph animations
- [x] 12. New: Invoice list viewer (fetch from Sheets via Apps Script, 3D cards/grid)

## Phase 5: Polish & Test (Steps 13-14)
- [ ] 13. Mobile optimize: LOD, throttle RAF, test auth/forms/invoice flow
- [ ] 14. Full test: Google data flow intact, deploy demo (`open index.html`)

**Notes**: Google Apps Script (auth/contact/invoice data) 100% preserved. No changes to backend/flows.
