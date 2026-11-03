# IP Dashboard — Access & Credentials

> 🔒 **Contains no secret values and must never contain any.**
> Records *what exists, who owns it, when it expires, how to replace it.*
> Actual values live in the credential store named in §2.

**Last verified:** ‹date you commit this›
**Maintainer:** Alex (contract ends ‹date›) — see §9 before that date.

## 1. Why this document exists

This project's most likely cause of death is not a bug. It is a credential expiring, or belonging to someone who has left, with nobody knowing it existed.

This has already happened:

- **Feb 2026 — the outage that created this maintenance effort.** The GitLab project access token expired after the original developers left. The cluster could no longer pull images; new pods went `ImagePullBackOff`. Nobody had rotated it because nobody knew it existed. *(A simultaneous restart of all deployments exhausted the namespace quota at the same time — see `architecture.md` §8. Both contributed.)*
- **Two dead secrets remain in the cluster** holding credentials for departed staff.
- **Both backend repositories are owned by personal accounts** of those same departed developers (§5).

Every entry below records an **owner** and an **expiry**. `‹UNKNOWN›` in either column is a latent outage.

## 2. Where the real values live

‹**DECISION NEEDED — Alex + professor**›

Requirements:
- **Not** the faculty cloud register holding the rest of the documentation — that has faculty-wide read access.
- Reachable by at least two people, one with a permanent contract.
- Suggested: institutional password manager, or a restricted entry owned by the professor.

| | |
|---|---|
| Store | ‹TBD› |
| Who has access | ‹TBD› |
| Who to ask | ‹TBD — probably the professor› |

Until filled in, the credentials effectively live in one person's laptop and memory.

## 3. The three places you log in

Unrelated systems with confusingly similar names.

| Host | What it is | Used for |
|---|---|---|
| `github.com/sitcomlab/iip-dash_2` | frontend source | `git push` |
| `gitlab.git.nrw` | GitLab **web UI** | managing tokens, the `ip-deployment` project |
| `registry.git.nrw` | GitLab **container registry** | `docker login` / `docker push` |

The last two are one GitLab system on two hostnames. The old ZIV GitLab (`zivgitlab.uni-muenster.de` / `zivgitlab.wwu.io`) had the same split and is **superseded — ignore entirely**.

> ⚠️ **The cluster never talks to GitHub.** It pulls images from `registry.git.nrw`. There is no GitHub credential in the deploy path. If you are hunting for "the token Kubernetes uses" in GitHub settings, you are on the wrong site.

## 4. Credential inventory

| # | Credential | Type | Owner | Expiry | Status |
|---|---|---|---|---|---|
| A | GitHub PAT (`ghp_…`, classic) | personal | Alex | ‹UNKNOWN› | ⚠️ personal |
| B | GitLab personal access token | personal | Alex | ‹UNKNOWN› | ⚠️ replace with deploy token |
| C1 | `gitlab-registry-secret` ← deploy-token-45 | **project** | project | 🔴 **‹DATE› (~2 months)** | 🔴 **caused Feb 2026 outage** |
| C2 | `ip-regcred-new` | personal | Alex | ‹UNKNOWN› | ⚠️ redundant, malformed |
| C3 | `gitlab-regcred` | personal | s.rajasirpi *(departed)* | — | ❌ delete |
| C4 | `regcred` | personal | f_nieb02 *(departed)* | — | ❌ delete |
| D | TLS `ipdash-certificate` | cert-manager | automated | 2027-02-08, auto-renews | ✅ none needed |
| E | Cluster namespace access | SSO | per person | n/a | ⚠️ only Alex verified |
| F | Build machine (ThinkPad P14s Gen 2a) | hardware | faculty | n/a | ⚠️ hand over, don't wipe |
| G | GitHub deploy keys | — | — | n/a | none exist — see §5 |

### A — GitHub Personal Access Token

- **Used for:** `git push` to `github.com/sitcomlab/iip-dash_2`
- **Username:** `Alaiya`; token is pasted as the *password* at the CLI prompt
- **Scope:** `repo` · prefix `ghp_` = classic token
- **Failure symptom:** `git push` rejected with an auth error
- **Find expiry / renew:** `github.com/settings/tokens` → **Tokens (classic)**

> ⚠️ **Website login ≠ CLI login.** You sign in to github.com with Google. That does *not* authenticate `git push`.
> 💡 The password prompt displays **nothing** when you paste. No dots. That is normal.

Optional: `git config --global credential.helper store` caches it unencrypted in `~/.git-credentials`.

Least critical of the three — the code is mirrored and recoverable even if nobody can push.

### B — GitLab personal access token (image push)

- **Used for:** `docker login registry.git.nrw`, then `docker push`
- **Scopes:** `read_registry` + `write_registry`
- **Failure symptom:** `docker push` → `HTTP Basic: Access denied`
- **Find expiry / renew:** `gitlab.git.nrw` → avatar → Edit profile → **Access Tokens**

🎯 **Improvement:** GitLab deploy tokens support `write_registry`. Replacing this with a project deploy token removes the last personal credential from the deploy path. See §6.

### C — Kubernetes image pull secrets

These let the **cluster** pull images. You never type them.

**Failure symptom:** new pods stuck in `ImagePullBackOff`. Existing pods keep serving, so the site stays up until a pod is next rescheduled — which happens on its own every few weeks. **The outage therefore arrives days or weeks after the actual expiry, disconnected from any action anyone took.** This is what makes expired pull secrets so hard to diagnose, and it is exactly what happened in Feb 2026.

**C1 — `gitlab-registry-secret`** · `registry.git.nrw` · user `gitlab+deploy-token-45`
✅ Correct pattern: belongs to the project, survives staff turnover. Referenced by `frontend`, `bi-backend`, `bikeinfra`.
🔴 **Expires in ~2 months.** This is the credential whose previous expiry caused the Feb 2026 outage. Extend it, ideally to non-expiring, before it repeats.
Manage at: `gitlab.git.nrw` → `uni-ms/sitcom/intelligent-pendeln/ip-deployment` → Settings → **Repository** → Deploy tokens (expand).

**C2 — `ip-regcred-new`** · `http://registry.git.nrw/` · user `alex.rump`
⚠️ Personal, created during the Feb/Mar 2026 recovery. The server key is malformed (includes scheme and trailing slash), so it may match nothing and do nothing. Also referenced by all three deployments. Remove once C1 is verified (§6).

**C3 — `gitlab-regcred`** · departed staff · **C4 — `regcred`** · departed staff, dead ZIV registry
Neither is referenced. **Delete both.**

#### Rotating a pull secret

```bash
kubectl create secret docker-registry gitlab-registry-secret \
  --docker-server=registry.git.nrw \
  --docker-username='<deploy-token-username>' \
  --docker-password='<deploy-token>' \
  --dry-run=client -o yaml | kubectl apply -f -
```

`--dry-run=client | kubectl apply` updates in place, so there is no window where the secret is missing.

Takes effect on **next pod creation**; existing pods are unaffected. Verify with the throwaway-pod test in §6. If pods are already failing:

```bash
kubectl delete pod <pod-name>     # one at a time — see §8
```

### D — TLS certificate

Fully automated: `Certificate/ip-dashboard` → `ClusterIssuer wwuit-acme` → secret `ipdash-certificate`. Valid to **2027-02-08**; five renewals so far. **No action required.**

Only failure mode: if the `Certificate` resource were deleted (e.g. a namespace rebuild), renewal silently stops. It is captured in `cluster-snapshot.yaml` and in `kubernetes/certificate.yaml` on branch `origin/deployment`.

```bash
kubectl get certificate
kubectl get secret ipdash-certificate -o jsonpath='{.data.tls\.crt}' \
  | base64 -d | openssl x509 -noout -subject -dates
```

### E — Cluster access

Granted per university SSO account, per namespace. **Required after every reboot** — the session does not survive one.

```bash
wwukube login
kubectl config use-context wwukube-prod-ms1
kubectl config set-context --current --namespace=ip-dashboard
```

> **Misleading error.** An expired session reports:
> `oauth2: cannot fetch token: 401 … invalid_client … MUST use 'client_secret_basic'`
> This looks like a broken OIDC config. It means **"log in again."**

🔴 **Only Alex is confirmed to have access.** If that account is deactivated with nobody else authorised, nobody can deploy, restart, inspect or roll back, and recovery requires a ZIV request that no one inside the project can make.

| | |
|---|---|
| Authorised today | Alex ‹anyone else? UNKNOWN — ask ZIV› |
| Requested | **Luca** — request sent ‹date›, **not yet verified** |
| Who grants it | ZIV / cluster admins |

**A grant is worth nothing until the person has run `kubectl get pods` on their own machine.** Verify before relying on it.

### F — Build machine

Production images are built on the faculty-assigned **ThinkPad P14s Gen 2a**, working copy `~/iip-dash_2`. Institutional policy, not personal preference.

Treat as infrastructure: **hand over, do not wipe**, or document how to rebuild an equivalent environment (Docker, `kubectl` 1.24, `wwukube`, Node 20).

### G — GitHub deploy keys

**None exist, and none ever did.** Deploy keys do not expire, so their absence is not a lapse. Submodule clones fail for a different reason — see §5.

## 5. 🔴 Repository ownership

| Repository | Owner | Contains | Risk |
|---|---|---|---|
| `sitcomlab/iip-dash_2` | **`sitcomlab` org** ✅ | frontend | institutionally owned |
| `niebl/OSMBicycleInfrastructure` | personal, **departed** | `bikeinfra` backend | 🔴 |
| `Rajasirpi/IP-OSeM-Backend` | personal, **departed** | `bi-backend` / Django | 🔴 |

Both backend repositories belong to the personal GitHub accounts of the two original developers, both of whom have left. The same two names appear as the owners of the dead pull secrets C3 and C4.

**Why this is worse than an expiring token.** The backends run `:latest` and therefore **cannot be rolled back** (`architecture.md` §3). Source is the only recovery path — and it sits on accounts the faculty does not control and cannot administer. If those accounts are deleted or the repos made private to the faculty, the backend source is gone permanently.

**Fix, in order of preference:**

1. **Transfer both repos into the `sitcomlab` org.** The current owner does this in Settings → General → Transfer ownership. Two minutes, preserves history and issues. One owner is reachable via Discord; the other has moved away and may need escalation through the professor and GitHub org admins.
2. **Fallback:** mirror clones held by the faculty — a snapshot, not ownership, and it does not survive the current maintainer either.
   ```bash
   git clone --mirror https://github.com/niebl/OSMBicycleInfrastructure.git
   git clone --mirror https://github.com/Rajasirpi/IP-OSeM-Backend.git
   ```

Local working clones currently exist at `~/IP_Backend` and `~/OSMInfrastructure`.

### Why submodule clones fail

`.gitmodules` points at these private repos over **SSH**:

```
url = git@github.com:niebl/OSMBicycleInfrastructure.git
url = git@github.com:Rajasirpi/IP-OSeM-Backend.git
```

No deploy key grants that access, so SSH fails. **Cloning over HTTPS with an account that has read access works** — that is how the local clones were made.

Fix after the transfer in §5 (so the URLs are only changed once): rewrite `.gitmodules` to the new HTTPS URLs and run `git submodule sync`.

### Attribution caveat

Some backend commits made by the current maintainer were pushed under a former developer's account during an access problem. **`git log` is not a reliable guide to who knows what** in these repositories.

## 6. Planned cleanup

Steps 1–2 are read-only and safe.

**1. 🔴 Extend deploy-token-45.** `gitlab.git.nrw` → `ip-deployment` → Settings → Repository → Deploy tokens. Record the exact expiry in §4 and §7. If the instance permits a blank expiry, use it. **This is the highest-priority item in this document.**

**2. Verify C1 alone can pull.**

```bash
kubectl run pullcheck --restart=Never \
  --image=registry.git.nrw/uni-ms/sitcom/intelligent-pendeln/ip-deployment/ip-dash-2:corner-weights-4 \
  --overrides='{"spec":{"imagePullSecrets":[{"name":"gitlab-registry-secret"}],
    "containers":[{"name":"pullcheck","image":"registry.git.nrw/uni-ms/sitcom/intelligent-pendeln/ip-deployment/ip-dash-2:corner-weights-4",
    "command":["sleep","30"],"resources":{"limits":{"cpu":"100m","memory":"128Mi","ephemeral-storage":"1Gi"},
    "requests":{"cpu":"10m","memory":"64Mi","ephemeral-storage":"1Gi"}}}]}}'
kubectl get pod pullcheck -w      # Running = deploy token works
kubectl delete pod pullcheck
```

**3. Create a deploy token with `write_registry`** and use it for `docker login` instead of personal token B.

**4. Remove `ip-regcred-new` from all three deployments**, leaving only `gitlab-registry-secret`, then delete C2.

**5. Delete C3 and C4** regardless — dangling credentials for departed staff.

## 7. Expiry calendar

Set a reminder **one week before each**, directed at someone who will still be here.

| Credential | Expires | Reminder set | Who is reminded |
|---|---|---|---|
| 🔴 C1 — deploy-token-45 | ‹DATE — ~2 months› | ☐ | ‹professor?› |
| A — GitHub PAT | ‹UNKNOWN› | ☐ | |
| B — GitLab PAT | ‹UNKNOWN› | ☐ | |
| D — TLS | 2027-02-08 | n/a | automated |

## 8. Restart safety

Credential rotation often means restarting pods.

1. **One deployment at a time.** The Feb 2026 outage followed a simultaneous restart of every deployment (identical `restartedAt` timestamps) while `frontend` ran `replicas: 2`. The namespace quota could not absorb it and `FailedCreate: exceeded quota` blocked everything.
2. **`bi-backend` is the tight one.** A single rolling restart fits today with ~640Mi memory to spare. Check first:
   ```bash
   kubectl describe resourcequota ip-dashboard
   ```
   For zero surge, `kubectl delete pod <bi-backend-pod>` replaces in place.

## 9. 🔴 Offboarding checklist

Run **before** the current maintainer's account is deactivated. Each item is irreversible afterwards.

- [ ] Luca authorised on namespace `ip-dashboard` **and verified** by running `kubectl get pods` himself
- [ ] Deploy-token-45 extended or made non-expiring; date recorded
- [ ] Personal token B replaced by a project deploy token
- [ ] `ip-regcred-new` removed from all deployments and deleted
- [ ] `gitlab-regcred` and `regcred` deleted
- [ ] **`OSMBicycleInfrastructure` transferred into the `sitcomlab` org**
- [ ] **`IP-OSeM-Backend` transferred into the `sitcomlab` org**
- [ ] `.gitmodules` updated to working HTTPS URLs after transfer
- [ ] All credential values present in the shared store (§2), reachable by someone with a permanent contract
- [ ] Expiry reminders point at a person who will still be here
- [ ] Build machine handover arranged
- [ ] Professor knows this document exists and where the credential store is
- [ ] Second user with push rights on `sitcomlab/iip-dash_2`

## 10. Open questions

| Question | How to answer |
|---|---|
| Exact expiry of C1? | GitLab → `ip-deployment` → Settings → Repository → Deploy tokens |
| Expiry of tokens A and B? | `github.com/settings/tokens` · GitLab → Edit profile → Access Tokens |
| Who else can access namespace `ip-dashboard`? | ask ZIV — not visible from inside |
| Will the departed developers transfer their repos? | Discord (one) · email / professor escalation (other) |
| Where will the credential store live? | **decision: Alex + professor** |
