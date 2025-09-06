# app/

This folder contains the main navigation and screen logic for the TARU mobile app, using Expo Router conventions.

Notes:
- Each file in `app/` is a route; folders like `(tabs)/` group routes without affecting the URL.
- Avoid creating barrels that import route components, as it can interfere with Expo Router's auto-discovery and bundling.
- Keep screen-specific hooks and helpers colocated with their screens when possible.