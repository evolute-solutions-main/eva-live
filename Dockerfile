FROM node:22-bookworm
ENV NODE_ENV=production

ARG OPENCLAW_VERSION=latest

RUN apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    ca-certificates \
    tini \
    python3 \
    python3-venv \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@10.23.0 --activate

# Install openclaw globally at build time (before /data volume is mounted)
RUN npm install -g openclaw@${OPENCLAW_VERSION}

# Persist user-installed tools by default by targeting the Railway volume.
# - npm global installs -> /data/npm
# - pnpm global installs -> /data/pnpm (binaries) + /data/pnpm-store (store)
ENV NPM_CONFIG_PREFIX=/data/npm
ENV NPM_CONFIG_CACHE=/data/npm-cache
ENV PNPM_HOME=/data/pnpm
ENV PNPM_STORE_DIR=/data/pnpm-store
ENV PATH="/data/npm/bin:/data/pnpm:${PATH}"

# Run openclaw as a direct command rather than node + entry.js path.
# OPENCLAW_ENTRY is intentionally empty so clawArgs() passes args directly to openclaw.
ENV OPENCLAW_NODE=openclaw
ENV OPENCLAW_ENTRY=

WORKDIR /app

# Wrapper deps
COPY package.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY src ./src

# The wrapper listens on $PORT.
# IMPORTANT: Do not set a default PORT here.
# Railway injects PORT at runtime and routes traffic to that port.
EXPOSE 8080

# Ensure PID 1 reaps zombies and forwards signals.
ENTRYPOINT ["tini", "--"]
CMD ["node", "src/server.js"]
