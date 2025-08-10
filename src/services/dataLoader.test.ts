import assert from "assert/strict";
import { fetchJSON, loadMushrooms } from "./dataLoader";

(async () => {
  // Mock fetch to simulate a network failure
  (global as any).fetch = () => Promise.reject(new Error("network down"));

  await assert.rejects(() => fetchJSON("/test"), /Network error/);

  const fallback = [{ id: "1" }];
  const res = await fetchJSON("/test", fallback);
  assert.deepStrictEqual(res, fallback);

  await assert.rejects(() => loadMushrooms(), /Network error/);

  console.log("tests passed");
})();
