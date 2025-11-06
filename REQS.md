**TL;DR:** One reusable FEEL core, one Node/TS LSP server, two thin clients. MVP runs the server via a command and both VS Code and IntelliJ consume it locally for diagnostics, hovers, completion, and basic semantic tokens.

# Purpose

Provide consistent FEEL language tooling across IDEs with a single, reusable parser/validator core. Deliver fast feedback (syntax/arity errors, built-in signatures, simple completions) for standalone `.feel` files and FEEL fragments inside DMN. Keep distribution simple now (local command), enable bundling later.

# Architecture and tooling

* **Monorepo:** pnpm workspaces. Packages:

  **Rewritten component list with concrete npm packages and current versions**

1. **Grammar**: `lezer-feel@1.9.0` as the FEEL grammar and parser runtime (pulls `@lezer/lr`, latest `1.4.3`). ([npm][1])

2. **Core**: use `lezer-feel@1.9.0` for CST/AST; optionally `feelin@4.3.0` for evaluation semantics and built-ins metadata; add `luxon@3.x` only if you handle temporal values directly. ([npm][2])

3. **LSP server**: `vscode-languageserver@9.0.1` + `vscode-languageserver-textdocument@1.0.12`. ([npm][3])

4. **Clients**:

   - **VS Code**: `vscode-languageclient@9.0.1`. ([npm][4])
   - **IntelliJ IDEA**: JetBrains LSP API in the plugin.

[1]: https://www.npmjs.com/package/lezer-feel?utm_source=chatgpt.com "lezer-feel"
[2]: https://www.npmjs.com/package/feelin/v/1.1.0?activeTab=versions&utm_source=chatgpt.com "feelin"
[3]: https://www.npmjs.com/package/vscode-languageserver?utm_source=chatgpt.com "vscode-languageserver"
[4]: https://www.npmjs.com/package/vscode-languageclient?utm_source=chatgpt.com "vscode-languageclient"
[5]: https://www.npmjs.com/package/%40bpmn-io/lang-feel?utm_source=chatgpt.com "bpmn-io/lang-feel"

# Features
* **LSP server capabilities (v1):** text sync, diagnostics from Lezer parse + basic validators, hover for built-ins, completion for keywords and built-ins, semantic tokens for keywords/idents/literals/ops. Settings: `dialect` (e.g., camunda), logging, optional max file size.
* **Tooling:** Node 20, TypeScript, pnpm, tsup (build), tsx (dev), ESLint, Prettier, Vitest.
  VS Code client: `vscode-languageclient`.
  IntelliJ client: JetBrains LSP API (plugin skeleton).
  Optional later: single-file binaries via Node SEA or `pkg/nexe` to bundle into the IntelliJ plugin.
* **Testing:** golden tests for parser diagnostics, smoke tests for LSP responses.
* **CI (later):** GitHub Actions matrix to build server and clients.

# MVP requirements (runnable locally, consumable by IDEA/VS Code)

* **Local run command:** a CLI entry point, e.g. `feel-lsp --stdio` (and `--tcp :7345` as an alternative). Starts quickly and logs readiness.
* **VS Code dev extension:** launches the local server by absolute path over stdio, registers the `feel` language, and shows:

    * live diagnostics on edit/save,
    * hover for a handful of built-ins,
    * completion for keywords/built-ins,
    * basic semantic tokens.
* **IntelliJ minimal plugin:** registers `.feel` file type and connects to the same locally running LSP (prefer TCP for MVP). Displays diagnostics, hover, and completion via the IDE LSP client. No bundling yet.
* **Config surface:** workspace/user setting for `dialect`, server path or TCP endpoint, and log level.
* **Docs:** one README section with: prerequisites, how to start `feel-lsp`, how to run VS Code extension in dev, how to point IntelliJ to the local server, and what features to expect in MVP.
