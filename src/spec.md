# Specification

## Summary
**Goal:** Build a mobile-first courier web app that scans orders one-at-a-time using the device camera or photo upload, runs on-device OCR to extract customer and street, and organizes a temporary shift list by street for fast delivery workflow.

**Planned changes:**
- Add an “Add order” flow optimized for mobile: capture via camera or upload an image, show a preview step, then submit for processing.
- Implement client-side, in-browser OCR with progress indication, deterministic parsing to auto-fill “Customer name” and “Street,” and an edit/confirm step (with manual entry fallback if extraction fails).
- Persist scanned orders locally so they survive refresh without login; add “Clear all” with confirmation.
- Create an orders overview grouped by street with expand/collapse per street and a scan-friendly order display.
- Within each street, aggregate repeated customers with a quantity indicator while allowing access to underlying individual orders.
- Add quick actions to delete an individual order and (optionally) toggle completed/delivered state with a visual distinction and/or filtering.
- Apply a consistent, high-readability visual theme across the app (avoid blue/purple as primary colors).

**User-visible outcome:** On a mobile browser, a courier can quickly scan or upload an order photo, confirm/edit extracted customer and street, save it to a locally persisted list, and view/manage orders grouped by street with customer aggregation and quick cleanup actions.
