# Deployment — fpt-dev-01

The dashboard runs as a single Docker container: an Express server that serves the
built React app **and** a small shared API backed by **SQLite**. All visitors on the
network read/write the same data. Data lives in the `dashboard-data` Docker volume and
survives redeploys.

- App URL once deployed: **http://fpt-dev-01:8080**
- Source of truth: the `main` branch on GitHub. Every push to `main` auto-deploys via a
  self-hosted GitHub Actions runner installed on fpt-dev-01.

## One-time setup on fpt-dev-01

Run these once, on the server (SSH in as a sudo-capable user).

### 1. Install Docker Engine + Compose plugin

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker "$USER"      # then log out/in so the group applies
docker compose version               # verify the compose plugin is present
```

### 2. Register the self-hosted GitHub Actions runner

In GitHub: **repo → Settings → Actions → Runners → New self-hosted runner → Linux**.
Follow the commands it shows (they include a one-time registration token), e.g.:

```bash
mkdir -p ~/actions-runner && cd ~/actions-runner
curl -o runner.tar.gz -L <URL-from-github>
tar xzf runner.tar.gz
./config.sh --url https://github.com/<org>/<repo> --token <TOKEN>   # accept default labels (adds: self-hosted, linux, x64)
sudo ./svc.sh install                 # install as a service so it runs on boot
sudo ./svc.sh start
```

The workflow targets `runs-on: [self-hosted, linux]`, so these labels must be present
(they are by default on a Linux runner). Make sure the runner's user is in the `docker`
group (step 1) so the workflow can run `docker`.

### 3. First deploy

Push any commit to `main` (or trigger **Actions → Deploy to fpt-dev-01 → Run workflow**).
The runner builds the image and starts the container. Then browse to
**http://fpt-dev-01:8080**.

> First load seeds the shared database. If you open it first from the browser that holds
> your curated content, that content becomes the shared baseline; otherwise it starts from
> the built-in defaults.

## Operations

```bash
# Manual deploy (from a checkout on the server)
docker compose --profile prod up -d --build

# Logs / status
docker compose --profile prod logs -f
docker compose --profile prod ps

# Back up the shared data (the SQLite volume)
docker run --rm -v ai-strat-dashboard_dashboard-data:/data -v "$PWD":/backup busybox \
  sh -c "cp /data/dashboard.db /backup/dashboard-backup-$(date +%F).db"

# Restore: stop the app, copy a .db back into the volume, start again.
```

> Volume name is `<project>_dashboard-data` — `docker volume ls` to confirm the exact
> prefix (it follows the compose project / directory name).

## Notes
- **No authentication** — anyone who can reach fpt-dev-01 on the network can view/edit.
  Put it behind the corporate network/VPN. HTTP basic auth can be added later if needed.
- **Concurrency**: last-writer-wins with a version guard; a conflicting save reloads the
  latest instead of clobbering. Suitable for occasional internal edits, not live co-editing.
- **Port**: change the host port by editing `ports` in `docker-compose.yaml` (e.g. `"80:8080"`).
