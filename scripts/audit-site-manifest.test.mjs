import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

test("site manifest audit reports both unclassified handlers and unrealized semantic human and machine paths", () => {
	const result = spawnSync(process.execPath, ["node_modules/tsx/dist/cli.mjs", "scripts/audit-site-manifest.ts"], { encoding: "utf8" });
	assert.equal(result.status, 1);
	assert.match(result.stderr, /Manifest paths without handlers/);
	assert.match(result.stderr, /- \/casework/);
	assert.match(result.stderr, /- \/zh\/contact/);
	assert.match(result.stderr, /- \/agent\/casework/);
	assert.match(result.stderr, /- \/agent\/contact/);
	assert.match(result.stderr, /- \/agent\/human-agent/);
	assert.match(result.stderr, /- \/llms\.mdx\/agent\/casework/);
	assert.match(result.stderr, /- \/llms\.mdx\/zh-agent\/contact/);
	assert.doesNotMatch(result.stderr, /Unclassified public route patterns/);
});
