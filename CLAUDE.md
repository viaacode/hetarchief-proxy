# CLAUDE.md

## After every code change

Always run the following after making any code change in this repo, and fix any errors before considering the change complete:

1. TypeScript type check:
   ```bash
   npx tsc --noEmit
   ```
2. Biome check (this repo has Biome configured — `biome.json`):
   ```bash
   npx biome check --write .
   ```
