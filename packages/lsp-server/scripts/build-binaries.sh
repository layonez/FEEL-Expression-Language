#!/usr/bin/env bash
#
# Build cross-platform standalone executables for FEEL LSP server using Bun
#
# This script compiles the LSP server into standalone binaries for:
# - macOS (x64, arm64)
# - Linux (x64, arm64, baseline for broader glibc compatibility)
# - Windows (x64)
#
# Usage: pnpm build:binaries
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKAGE_DIR="$(dirname "$SCRIPT_DIR")"
OUTPUT_DIR="$PACKAGE_DIR/dist/bin"
ENTRY_POINT="$PACKAGE_DIR/src/cli.ts"

# Ensure output directory exists
mkdir -p "$OUTPUT_DIR"

echo "🔨 Building FEEL LSP standalone executables..."
echo ""

# Function to build for a specific target
build_target() {
  local platform=$1
  local arch=$2
  local target=$3
  local ext=$4

  local output_name="feel-lsp-${platform}-${arch}${ext}"
  local output_path="$OUTPUT_DIR/$output_name"

  echo "📦 Building $output_name ($target)..."

  if pnpm dlx bun build "$ENTRY_POINT" --compile --target="$target" --outfile="$output_path"; then
    echo "✅ $output_name created successfully"
  else
    echo "❌ Failed to build $output_name"
    exit 1
  fi
}

# Build for each platform
build_target "darwin" "x64" "bun-darwin-x64" ""
build_target "darwin" "arm64" "bun-darwin-arm64" ""
build_target "linux" "x64" "bun-linux-x64-baseline" ""
build_target "linux" "arm64" "bun-linux-arm64" ""
build_target "win32" "x64" "bun-windows-x64" ".exe"

echo ""
echo "🎉 All binaries built successfully!"
echo "📁 Output directory: $OUTPUT_DIR"
