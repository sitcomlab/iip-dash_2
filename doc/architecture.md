# IP Dashboard — Architecture

**Audience:** whoever inherits this. Assumes Docker and command-line familiarity; assumes no prior knowledge of this project.
**Status:** active service. Official development ended 2024-12-31; maintenance is inherited and ad hoc.
**Last verified:** 2026-09-22 against the live cluster.

## 1. What it is

A public web dashboard visualising cycling infrastructure and "bikeability" for **Münster** and **Osnabrück**, at `https://ipdashboard.uni-muenster.de/muenster` and `/osnabrueck`. Used for research and faculty presentation; the primary presentation device is an **iPad in landscape**.

Part of the *Intelligent Pendeln* (IP) project. Data comes from OpenStreetMap and from senseBox bike sensors via openSenseMap.

## 2. Request flow

```
Browser
  │  https://ipdashboard.uni-muenster.de
  ▼
Istio ingressgateway  ── TLS: secret ipdash-certificate
  │                       (cert-manager, ClusterIssuer wwuit-acme, auto-renewing)
  │                      Gateway + VirtualService → kubernetes/gateway.yaml,
  │                                                 kubernetes/virtualservice.yaml
  ▼
Service nginx :80  →  nginx pods ×2   [ConfigMap nginx-config → /etc/nginx/conf.d/default.conf]
  │
  ├─ /                → frontend:80   → Next.js  :3000
  ├─ /_next/          → frontend:80   → Next.js  :3000
  ├─ /bicycle_infra/  → bikeinfra:80  → Node.js  :8000
  └─ /bike_data/      → bi-backend:80 → Django   :8000
```

Everything is `ClusterIP`; nothing but the Istio gateway is reachable from outside.

There is **no Ingress resource** — routing is Istio (`Gateway` + `VirtualService`). Both are captured in `istio-snapshot.yaml` and exist on branch `origin/deployment`.

## 3. Components

| Deployment | Image | Replicas | Purpose |
|---|---|---|---|
| `frontend` | `…/ip-dash-2:<tag>` | 1 | Next.js 14 dashboard UI |
| `nginx` | `nginx:latest` ⚠️ | 2 | reverse proxy / path routing |
| `bi-backend` | `…/osem-data-fetcher:latest` ⚠️ | 1 | Django; senseBox data + bikeability |
| `bikeinfra` | `…/bikeinfra:latest` ⚠️ | 1 | Node.js; OSM cycling infrastructure |

⚠️ `:latest` means **no rollback is possible** for these three, and a pod restart silently pulls whatever is newest in the registry. Only `frontend` uses unique tags. **Do not copy the `:latest` pattern.**

Registry for all project images: `registry.git.nrw/uni-ms/sitcom/intelligent-pendeln/ip-deployment/`
`nginx` pulls from Docker Hub **anonymously** — no pull secret, so it is exposed to Docker Hub rate limits as well as unpinned-version drift.

**Naming traps.** One service, several names:

| Deployment | Image | URL path | Source repo | Manifest dir |
|---|---|---|---|---|
| `bi-backend` | `osem-data-fetcher` | `/bike_data/` | `IP-OSeM-Backend` | `kubernetes/osem_backend/` |
| `bikeinfra` | `bikeinfra` | `/bicycle_infra/` | `OSMBicycleInfrastructure` | `kubernetes/osm_backend/` |

## 4. Source repositories

| Component | Repository | Owner | Notes |
|---|---|---|---|
| frontend | `github.com/sitcomlab/iip-dash_2` | `sitcomlab` org ✅ | branch `main` = production |
| K8s manifests | same repo, branch `origin/deployment` | `sitcomlab` org ✅ | ⚠️ stale, see §9 |
| `bi-backend` | `github.com/Rajasirpi/IP-OSeM-Backend` | 🔴 personal, departed | submodule |
| `bikeinfra` | `github.com/niebl/OSMBicycleInfrastructure` | 🔴 personal, departed | submodule |

🔴 **Both backend repositories sit on the personal GitHub accounts of developers who have left.** Combined with `:latest` images that cannot be rolled back, the source is the only recovery path for those services — and the faculty does not control it. See `access-and-credentials.md` §5 for the transfer plan.

**Submodule clones fail** because `.gitmodules` uses SSH URLs (`git@github.com:…`) to private repos and no deploy key grants access. Cloning over **HTTPS with an authorised account works**. Local working clones: `~/IP_Backend`, `~/OSMInfrastructure`.

## 5. Data flow

### senseBox pipeline (`bi-backend`) — live, verified 2026-09-22

```
/etc/cron.d/fetch_bike_data    0 */6 * * *
  manage.py fetch_bike_data ms && manage.py fetch_bike_data os
  → /app/tracks/{tracks,sensor_data,BI}/     (PVC bi-storage)
  → stdout of PID 1
```

The cron lives **inside the image**, so it is invisible to `kubectl get cronjobs`. Because it writes to PID 1's stdout, pod logs are the health check:

```bash
kubectl logs deploy/bi-backend --tail=100 | grep -i fetch
```

Container entrypoint is `python3 -u manage.py runserver 0.0.0.0:8000` — Django's **development server**, which upstream explicitly says must not be used in production. `DEBUG` appears to be off (error pages are plain, not tracebacks).

### Static seed data

In `/app/tracks`, dated Aug 2025, never refreshed by the cron:

- `ms_cycling_quality_index.geojson` (31 MB)
- `os_cycling_quality_index.geojson` (36 MB)
- `os_accidents.geojson` (744 KB)

🔴 ‹UNKNOWN: provenance›. Not in any repository examined. If `bi-storage` is lost, nobody currently knows how to regenerate these. **Copy them to faculty cloud storage:**

```bash
POD=$(kubectl get pod -l app=django -o jsonpath='{.items[0].metadata.name}')
kubectl cp ip-dashboard/$POD:/app/tracks/ms_cycling_quality_index.geojson ./ms_cqi.geojson
kubectl cp ip-dashboard/$POD:/app/tracks/os_cycling_quality_index.geojson ./os_cqi.geojson
kubectl cp ip-dashboard/$POD:/app/tracks/os_accidents.geojson             ./os_accidents.geojson
```

### OSM pipeline (`bikeinfra`)

`start.sh`:

```bash
#!/bin/bash
mkdir out
python3 serve.py & node bicycleinfrastructure.js && fg
```

Overpass queries live in `queries_OS/`. The served `out/` directory is dated **Nov 2025 and baked into the image**, while the PVC mounted at `/apps/out` contains only `lost+found`. So the data appears to be static from image build, and the 8Gi PVC is doing nothing.

‹UNKNOWN: whether this pipeline still refreshes at all. Check with `kubectl exec deploy/bikeinfra -- pwd` to see whether `mkdir out` lands on the PVC path or elsewhere.›

## 6. Storage

| PVC | Size | Mount | Class | Contents |
|---|---|---|---|---|
| `bi-storage` | 16Gi | `bi-backend:/app/tracks` | `cinderbronze` | senseBox data + seed GeoJSON |
| `bikeinfra-storage` | 8Gi | `bikeinfra:/apps/out` | `cinderbronze` | empty — likely wrong path |

🔴 **`reclaimPolicy: Delete`** — deleting a PVC destroys the underlying volume.
🔴 **No backups exist.**
⚠️ PVC quota exhausted at **2/2**; a third cannot be created without a ZIV request. (`cinderbronze-retain` is available at 0/0 if a retaining volume is ever needed.)

## 7. Frontend configuration

Build-time variables live in **`.env.prod`, committed to the repository**. The Dockerfile does `mv .env.prod .env.local` before `npm run build`.

> **Rule:** a new `NEXT_PUBLIC_*` variable must be added to `.env.prod` **and committed**, or it is silently `undefined` in production — with no build-time error.

| Variable | Value | Active |
|---|---|---|
| `…BICYCLE_INFRASTRUCTURE_URL_MS` / `_OS` | `/bicycle_infra/bicycleinfrastructure_MS` / `_OS` | ✅ |
| `…OSM_BIKEABILITY_API_URL_MS` / `_OS` | `/bike_data/sensebox/osm-bikeability-index/ms/` / `os/` | ✅ |
| `…BIKEABILITY_API_URL_MS` / `_OS` | — | ❌ commented out |
| `…ANONYMIZATION_API_URL_MS` / `_OS` | — | ❌ commented out |

The last two are `undefined` in production, so those layers are inert. Believed deliberate — OSM bikeability superseded the senseBox one — but ‹UNVERIFIED: ask the professor›.

## 8. Resource quota — and the February 2026 outage

Namespace `ip-dashboard`: **32Gi memory**, **16Gi ephemeral-storage**, **6 CPU**.

| | memory | ephemeral | cpu |
|---|---|---|---|
| `bi-backend` | 15360Mi | 5Gi | 1800m |
| `bikeinfra` | 1024Mi | 1Gi | 600m |
| `frontend` | 128Mi | 1Gi | 200m |
| `nginx` ×2 | 256Mi | 2Gi | 400m |
| **used / hard** | **16768 / 32768Mi** | **9 / 16Gi** | **3000 / 6000m** |

`bi-backend` alone holds **47% of the memory quota** while requesting only 128Mi.

**What actually happened in Feb 2026.** Every deployment carries an identical `restartedAt: 2026-02-20T12:36:02` annotation — everything was restarted at once, while `frontend` was at `replicas: 2`. With `maxSurge: 2` on each deployment, the combined surge exceeded the namespace quota. The cluster responded with `FailedCreate: exceeded quota` and `ProgressDeadlineExceeded`, visible to this day in the deployment annotations:

```
pods "bikeinfra-85f66f546b-vl42v" is forbidden: exceeded quota: ip-dashboard,
requested: limits.memory=1Gi, used: limits.memory=32256Mi, limited: limits.memory=32Gi

pods "frontend-7cb6d5bb5d-kqkbh" is forbidden: exceeded quota: ip-dashboard,
requested: limits.ephemeral-storage=1Gi, used: 16Gi, limited: 16Gi
```

Once the quota is full, **no deployment in the namespace can create pods** — including `frontend`. (An expired pull secret was also in play at the time; both contributed.)

**Practical rules:**

- ✅ Frontend deploys are safe — they need ~256Mi / 2Gi against 16000Mi / 7Gi free.
- ✅ A **single** `bi-backend` rolling restart fits today, with ~640Mi memory to spare.
- 🔴 **Never restart several deployments at once**, and never raise replica counts without doing the arithmetic.
- Check before any deploy or restart: `kubectl describe resourcequota ip-dashboard`
- For zero surge on `bi-backend`: `kubectl delete pod <pod>` replaces in place instead of adding one.
- **Unfixed:** set `bi-backend` `maxSurge: 1` and re-examine whether that 15Gi limit is real or a guess.

`forbid-system-priorityclasses` showing `pods 0/0` is a platform guardrail, not a problem.

## 9. Manifests vs. reality

Branch `origin/deployment` contains a full manifest set:

```
kubernetes/certificate.yaml
kubernetes/gateway.yaml
kubernetes/virtualservice.yaml
kubernetes/frontend/{deployment,service,networkpolicy}.yaml
kubernetes/nginx/{deployment,service,configmap,networkpolicy}.yaml
kubernetes/osem_backend/{deployment,service,persistentvolumeclaim,networkpolicy}.yaml
kubernetes/osm_backend/{deployment,service,persistentvolumeclaim,networkpolicy}.yaml
docker-compose.yml, docker-compose.prod.yml
```

🔴 **They do not match the running cluster.** The stored frontend image is `…/ip-dash-2` with **no tag**; production runs `:corner-weights-4`. Running `kubectl apply -f` from that branch would revert production to `:latest` while appearing to succeed.

Divergence accumulated because deploys use `kubectl set image` and ConfigMaps were hand-edited. Snapshots of actual state: `cluster-snapshot.yaml`, `istio-snapshot.yaml`.

**Until reconciled, `kubectl set image` is the only supported deploy path.**

## 10. Credentials

Summary only — full detail, rotation procedures and the offboarding checklist are in **`access-and-credentials.md`**.

| Secret | Registry | Identity | Status |
|---|---|---|---|
| `gitlab-registry-secret` | `registry.git.nrw` | `gitlab+deploy-token-45` | ✅ project-owned · 🔴 expires ~2 months |
| `ip-regcred-new` | `http://registry.git.nrw/` | `alex.rump` | ⚠️ personal, malformed key |
| `gitlab-regcred` | `registry.git.nrw` | `s.rajasirpi` *(departed)* | ❌ delete |
| `regcred` | `zivgitlab.wwu.io` | `f_nieb02` *(departed)* | ❌ delete |
| `ipdash-certificate` | — | cert-manager | ✅ auto-renewing to 2027-02-08 |

The cluster **never pulls from GitHub**. GitHub holds source only; images come from `registry.git.nrw`.

## 11. Known defects

1. `nginx`, `bi-backend`, `bikeinfra` run `:latest` — no rollback, silent updates on restart
2. `nginx` pulls anonymously from Docker Hub — no pull secret, rate-limit exposure
3. 🔴 **Django admin reachable at `/bike_data/admin/` (returns 302).** The `return 404` blocks exist in ConfigMap `nginx-config` but are **commented out**. Uncomment, then `kubectl rollout restart deployment/nginx`.
4. `bi-backend` runs `manage.py runserver` — Django's dev server, not production-grade
5. Stale ConfigMap `nginx-conf` (dead: `listen 3000`, targets services that no longer exist) alongside the live `nginx-config`
6. Duplicate Service `bikeinfa` (typo) alongside `bikeinfra` — both select the same pods
7. `bikeinfra` PVC mounted at a path the application does not appear to use
8. No backups of either PVC; `reclaimPolicy: Delete`
9. Münster and Osnabrück pages are near-duplicates — layout changes must be applied to both
10. Two dead credentials for departed staff still present in the namespace
11. `Dockerfile` uses `FROM node:latest` and `npm install` — not reproducible; should be `node:20-bookworm` and `npm ci`
12. 39 pre-existing Dependabot advisories on the frontend (known noise for deployment purposes)

## 12. Open questions

| Question | How to answer |
|---|---|
| Provenance of the seed GeoJSON files? | ask the professor; check `OSMBicycleInfrastructure` |
| Does the `bikeinfra` pipeline still refresh? | `kubectl exec deploy/bikeinfra -- pwd`, then inspect `out/` |
| Were the bikeability/anonymization layers disabled deliberately? | ask the professor |
| Will the departed developers transfer their repositories? | Discord (one) · email / professor escalation (other) |
| Who else can access namespace `ip-dashboard`? | ask ZIV — not visible from inside the namespace |
| Exact expiry of deploy-token-45? | GitLab → `ip-deployment` → Settings → Repository → Deploy tokens |
