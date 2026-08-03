#!/usr/bin/env bash
# Runs once when the container/Codespace is first created. Kept as a plain
# script rather than devcontainer "features" — see the note in
# devcontainer.json about features forcing a buildkit derived-image build
# that was crashing on Codespaces hosts.
set -euo pipefail

npm ci

# `git config core.hooksPath` is what activates .githooks/pre-commit. Git will
# not use a committed hooks directory until it is pointed at one, and it is
# per-clone rather than per-repo, so every new Codespace has to run this. It
# applies to agents too — they commit through the same git.
git config core.hooksPath .githooks

# GitHub CLI (gh) — official apt repo for Debian/Ubuntu, per
# https://github.com/cli/cli/blob/trunk/docs/install_linux.md
if ! command -v gh >/dev/null 2>&1; then
  (type -p wget >/dev/null || (sudo apt update && sudo apt install wget -y)) \
    && sudo mkdir -p -m 755 /etc/apt/keyrings \
    && out=$(mktemp) && wget -nv -O"$out" https://cli.github.com/packages/githubcli-archive-keyring.gpg \
    && cat "$out" | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
    && sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
    && sudo mkdir -p -m 755 /etc/apt/sources.list.d \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
    && sudo apt update \
    && sudo apt install gh -y
fi

# GitHub Copilot CLI — npm global install, per
# https://github.com/github/copilot-cli
npm install -g @github/copilot
