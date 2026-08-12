IP Dashboard — Frontend Maintenance Log & Reference

Last updated: [today's date]. Maintained by: Alex.

    Context for future readers: This project's official development ended Dec 31, 2024, but the service is still in active use for research and faculty admin. There is no maintenance team—maintenance is inherited, ad hoc. This document exists because the original developers wrote none. Please keep it updated.

1. What this session accomplished

Goal: the GUI was optimized for desktop browsers but cramped on iPad (the intended presentation device). Specifically, on iPad the Bikeability panel ate >50% of screen width, squeezing the map so small that the on-map controls (routing box, legend) overlapped and made the map unusable.

Changes made:

    Made the Bikeability side panel foldable on both city pages (/muenster and /osnabrueck).
        A compact burger button (MUI MenuIcon) toggles the panel.
        The panel auto-collapses on screens < 1280px (iPads) on first load, but stays open on wide desktop screens, so the desktop experience is unchanged.
        When toggled, a resize event is fired after 250ms to nudge Leaflet into redrawing map tiles (prevents gray-tile gaps).
    (Earlier related work, for context:) Added funding logos to the navbar, including a mobile-specific layout; fixed a hardcoded routing service URL.

Deployed under image tag: foldable-panel.
2. How the code is structured (what we learned)
The big picture

The live service is made of 4 Kubernetes deployments, but for frontend/GUI work you only ever touch one thing: the Next.js app, whose source lives on GitHub (not in the ip-deployment infra repo).
Layer	Where	You touch it when…
Source code	~/iip-dash_2/ on the ThinkPad	Editing the GUI
GitHub backup	github.com/sitcomlab/iip-dash_2	git push
Image registry	registry.git.nrw/.../ip-dash-2	docker push
Kubernetes (runs it live)	cluster wwukube-prod-ms1, namespace ip-dashboard	kubectl set image

Key mental model: The component tree is just files on your laptop. Kubernetes only matters at the very end (deploy). Editing the GUI never touches Kubernetes.
The two city pages

    src/app/muenster/page.js
    src/app/osnabrueck/page.js

These are near-duplicates. They differ only in: city name, map center coordinates, and the _MS vs _OS environment-variable data sources. ⚠️ Any layout change to one almost always needs to be applied to the other too. (This duplication is technical debt—there's no shared layout component.)

Page layout structure (both pages):

php
<main>
  <Navbar />
  <MapContext.Provider>
    <MapFeatureProvider>
      <div flex row>                    ← splits screen into panel | map
        <div scroll wrapper>            ← LEFT: the foldable panel
          <div grid>
            <BIWeightsControlTile />     "Bikeability-Gewichtungen"
            <BikeabilityInfoTile />      "Bikeability Statistiken"
        <button>                        ← the fold/unfold burger toggle
        <div flex-1>                    ← RIGHT: the map
          <BikeInfrastructTile />

Important components & where they live
What you see on screen	File
Top nav bar (logos, city switch)	src/components/Elements/Navbar/index.jsx
"Bikeability-Gewichtungen" (the slider panel)	src/components/BIWeightsControlTile/index.jsx
"Bikeability Statistiken" (numbers + histogram)	src/components/BikeabilityInfoTile/index.jsx
The map itself	src/components/BikeInfrastructTile/
Layer on/off toggle box (on map, top-right)	src/components/BikeInfrastructTile/LayerControl/LayerControl.jsx
The map legend (on map)	src/components/BikeInfrastructTile/LayerControl/Legend.tsx
Routing box (Start/End inputs, on map, top-left)	src/components/BikeInfrastructTile/mapContent/RoutingMachine.js
Reusable card wrapper for tiles	src/components/BaseTile/index.jsx
SVG icons (barrel export)	src/components/Icons/index.ts
Two different kinds of "controls" (this tripped us up—remember it)

    Page-grid tiles (Bikeability panels): laid out in a CSS grid next to the map, as siblings. Their width is controlled by the page layout + BaseTile's min-w-96 (384px minimum width). These are what crowd the map on narrow screens.
    Leaflet map overlays (routing box, legend, layer control): positioned on the map in its corners (topleft/topright). They only appear to "cover the map" when the map itself is too small. Fix the map's width → they stop overlapping.

Responsive breakpoints — the iPad gotcha

    The old "mobile" styling targeted phones: @media (max-width: 768px) and ≤480px.
    iPads fall right through those: landscape ≈ 1024px, portrait ≈ 810px. Both land in "desktop" styling. This is why things looked fine on a phone but broken on iPad.
    Our fold logic therefore triggers at < 1280px, which covers iPads while leaving true desktops alone.
    Presentation iPads are used in landscape (∼1024px). Target that when testing.

Known technical debt / oddities (frontend)

    Münster & Osnabrück pages are duplicated (see above).
    Legend.tsx has a broken CSS media query (the @media (max-width: 480px) block is missing a closing }) and over-shrinks markers to unreadable sizes on small screens. Not yet fixed.
    LayerControl.jsx has no responsive sizing at all (icons hardcoded to 3rem). Not yet fixed.
    BaseTile forces min-w-96 (384px), which is the direct cause of the panel crowding the map.
    39 pre-existing Dependabot vulnerabilities on GitHub (not introduced by us).
    Git submodules (IP-OSeM-Backend, OSMBicycleInfrastructure) fail to clone (SSH key issues) — not needed for frontend work, ignore them.

3. Local development workflow

bash
cd ~/iip-dash_2
npx next dev

Then open http://localhost:3000 (add /muenster or /osnabrueck).

    ⚠️ Do NOT use npm run dev — it runs docker compose up first, which tries to pull backend images you can't access locally, and fails. npx next dev runs only the Next.js frontend.
    Backend features won't work locally (map tiles, routing, bikeability data all come from the cluster). That's normal and expected. You can still test all layout / GUI / navbar / fold behaviour.
    Test iPad layouts with browser DevTools: F12 → device-toolbar toggle → pick an iPad (landscape).

To undo local changes before committing: git checkout <file> reverts that file to the last commit.
4. Deployment workflow (the full sequence)

Run from ~/iip-dash_2. Pick a new descriptive tag each time (past tags: routing-fix, mobile-logos, foldable-panel).

bash
# 0. Connect kubectl (after a reboot / expired session)
wwukube login
kubectl config use-context wwukube-prod-ms1
kubectl config set-context --current --namespace=ip-dashboard

# 1. Commit + push source to GitHub
git add .
git commit -m "Describe your change"
git push

# 2. Build the image (replace TAG)
docker build -t registry.git.nrw/uni-ms/sitcom/intelligent-pendeln/ip-deployment/ip-dash-2:TAG .

# 3. Push image to registry
docker push registry.git.nrw/uni-ms/sitcom/intelligent-pendeln/ip-deployment/ip-dash-2:TAG

# 4. Point the cluster at the new image
kubectl set image deployment/frontend frontend=registry.git.nrw/uni-ms/sitcom/intelligent-pendeln/ip-deployment/ip-dash-2:TAG

# 5. Watch the rollout
kubectl rollout status deployment/frontend

Verify at https://ipdashboard.uni-muenster.de (/muenster and /osnabrueck), ideally on the actual iPad.

If something breaks in production:

bash
kubectl rollout undo deployment/frontend

Instantly reverts to the previous working image. Your safety net—use it without hesitation.
5. Authentication & tokens — READ THIS, it's the #1 source of pain

There are three completely separate credentials, and they get confused constantly. They are NOT interchangeable.
#	What	Used for	How you log in
A	GitHub Personal Access Token	git push to GitHub	Username Alaiya + token as "password"
B	GitLab (git.nrw) Personal Access Token	docker login registry.git.nrw (pushing images from your laptop)	GitLab username + token as password
C	Kubernetes image-pull secret (ip-regcred-new)	the cluster pulling images down	Stored in the cluster, not typed by you
Key facts to remember

    Website login ≠ git/docker login. You sign in to the GitHub website with Google. That does not work for git push on the command line — that needs token A.
    The password prompt shows nothing when you paste a token. No dots, no characters. That's normal. Paste and hit Enter.
    All three tokens expire. This is the single most common cause of outages here. In fact:
        The Feb 2026 ImagePullBackOff incident was caused by token C expiring (previous admins left, nobody rotated it).
        Any time docker push suddenly fails with HTTP Basic: Access denied, suspect token B expired.
        Any time git push suddenly fails, suspect token A expired.

Creating / renewing tokens

    GitHub (A): https://github.com/settings/tokens → Generate new token (classic) → scope: repo → copy immediately (shown once).
    GitLab (B): https://gitlab.git.nrw → avatar → Preferences / Edit profile → Access Tokens → scopes: read_registry + write_registry (write needed to push) → copy immediately.
    Kubernetes pull secret (C): only needed if the cluster can't pull (new pods stuck in ImagePullBackOff). Runbook is in the main infrastructure briefing doc (create a GitLab deploy token with read_registry, then recreate the k8s docker-registry secret). Don't touch this unless deploys succeed but pods won't start.

Optional convenience

bash
git config --global credential.helper store

Makes git remember token A after the next push (stored unencrypted at ~/.git-credentials). Fine on a personal work laptop; skip if you'd rather type it each time.
🔔 Set calendar reminders

Note each token's expiry date when you create it and set a reminder ∼1 week before. This one habit prevents the most common failure mode of this whole service.
6. Quick "how do I…?" index

    Change something visual → edit files in ~/iip-dash_2/src/, test with npx next dev.
    Change a city page layout → edit both muenster/page.js and osnabrueck/page.js.
    See it live → run the full deploy sequence (§4).
    A deploy made things worse → kubectl rollout undo deployment/frontend.
    git push rejected → GitHub token (A) expired → make a new one.
    docker push "Access denied" → GitLab token (B) expired → docker login registry.git.nrw with a fresh token.
    New pods stuck ImagePullBackOff → cluster pull secret (C) expired → see infra briefing runbook.
    Local npm run dev fails → use npx next dev instead.

End of document. Please keep it current—the next person will thank you, and so will future-you.
