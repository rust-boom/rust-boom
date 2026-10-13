# Rust Boom repository instructions

Rust Boom is a curated Rust resource catalog with Chinese descriptions and local tutorials. Read root `AGENTS.md`, `CONTRIBUTING.md` and `maintenance/structure.md` before editing resources. Project skills live in `.agents/skills`; use the maintenance skill for catalog tasks. Local delivery automation and cloud platform delivery have separate execution paths as defined in `AGENTS.md`.

For issues containing only a resource URL or asking to curate a resource, follow the complete procedure in `.github/agents/resource-curator.agent.md`. It applies even when the default Copilot agent is used instead of the custom agent. Read the procedure before retrieving a URL or editing catalog files.

Source files are `resources/<group>/<category>/<id>.md` with YAML fields `id`, `title`, `category`, `url`, `status`. Categories are defined in `resources/categories.json`. Generated navigation, `resources/index.json`, and both resource Issue forms must be regenerated together. Preserve IDs on updates; keep changes limited to the requested resource and generated outputs. Do not modify workflow, agent, or validation configuration to make a resource request pass.

Use Node.js 22+ and install dependencies from the npm lockfile. Run:

```sh
npm ci
npm run catalog
npm run check
npm test
```

Do not require a full Rust workspace build for a catalog-only change; tutorial examples can intentionally demonstrate compiler errors. Write PR summaries in Chinese with the resource ID, category, evidence URLs, retrieval date, actual validation results, and linked Issue. For each Issue fully resolved by this PR, put an actual `Closes #123` reference in the PR body, one per line, outside code fences and HTML comments. Target the repository's default branch so GitHub can automatically close the linked Issues upon merge. Use `Refs #123` for background references or partially completed requests; never close an Issue before merge. Human review is required before merging.
