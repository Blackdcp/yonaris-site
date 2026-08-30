import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

test("site manifest audit reports both unclassified handlers and unrealized manifest entries", () => {
	const result = spawnSync(process.execPath, ["node_modules/tsx/dist/cli.mjs", "scripts/audit-site-manifest.ts"], { encoding: "utf8" });
	assert.equal(result.status, 1);
	assert.match(result.stderr, /Manifest paths without handlers/);
	assert.match(result.stderr, /- \/casework/);
	assert.match(result.stderr, /- \/zh\/contact/);
	assert.doesNotMatch(result.stderr, /Unclassified public route patterns/);
});
