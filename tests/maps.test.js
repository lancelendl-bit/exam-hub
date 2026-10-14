import { describe, it, expect } from "vitest";
import { indexMap, neighbors, links, flowPath, searchNodes, glossary, validateMap, LIMITS } from "../src/mapModel.js";
import { mapHTML } from "../src/mapView.js";
import { MAPS } from "../src/maps.js";
import { CERTS, certOf } from "../src/certs.js";

const node = (id, col, extra = {}) => ({ id, g: "a", col, name: id.toUpperCase(), sub: `${id} sub`, what: `${id} does something.`, feat: [`${id} fact one`], lingo: [], traps: [], ...extra });
const good = () => ({
  title: "Test map", intro: "Intro text.", src: ["https://example.com/docs"],
  groups: { a: "Group A", b: "Group B" },
  columns: ["One", "Two", "Three"],
  nodes: [
    node("src1", 0), node("load", 1, { lingo: [["Watermark", "Marks the last row copied."]], traps: ["Wrong tool for the job."] }),
    node("store", 2, { g: "b" }), node("serve", 2, { g: "b", feat: ["Reads the store, fast"] }),
  ],
  edges: [["src1", "load", "files"], ["load", "store", ""], ["store", "serve", "reads"]],
  flows: [{ name: "Load", desc: "Files to serving.", steps: [["src1", "Files arrive."], ["load", "Loaded."], ["store", "Stored."]] }],
});

describe("map model", () => {
  const map = good();
  it("indexes nodes and colours groups by position", () => {
    const { byId, groupIndex } = indexMap(map);
    expect(byId.load.name).toBe("LOAD");
    expect(groupIndex).toEqual({ a: 0, b: 1 });
  });
  it("finds neighbours and links in both directions", () => {
    const n = neighbors(map, "load");
    expect([...n.ids].sort()).toEqual(["load", "src1", "store"]);
    expect([...n.edges].sort()).toEqual([0, 1]);
    expect(links(map, "load")).toEqual({ out: [{ id: "store", label: "" }], inn: [{ id: "src1", label: "files" }] });
  });
  it("follows a flow and the edges that join its steps", () => {
    const p = flowPath(map, map.flows[0]);
    expect(p.ids).toEqual(["src1", "load", "store"]);
    expect([...p.edges].sort()).toEqual([0, 1]);
  });
  it("searches names, text, terms and traps", () => {
    expect([...searchNodes(map, "watermark")]).toEqual(["load"]);
    expect([...searchNodes(map, "wrong tool")]).toEqual(["load"]);
    expect(searchNodes(map, "reads fast").has("serve")).toBe(true);
    expect(searchNodes(map, "  ").size).toBe(0);
    expect(searchNodes(map, "zzz").size).toBe(0);
  });
  it("lists the glossary alphabetically with the node it belongs to", () => {
    const m = good();
    m.nodes[0].lingo = [["Zebra", "z"]];
    expect(glossary(m).map((g) => `${g.term}:${g.id}`)).toEqual(["Watermark:load", "Zebra:src1"]);
  });
});

describe("map validation", () => {
  it("accepts a sound map", () => expect(validateMap(good())).toEqual([]));
  const broken = (fn) => { const m = good(); fn(m); return validateMap(m).join(" | "); };
  it("catches bad ids, groups and columns", () => {
    expect(broken((m) => (m.nodes[1].id = "Load Me"))).toContain("lowercase");
    expect(broken((m) => (m.nodes[1].id = "src1"))).toContain("duplicate");
    expect(broken((m) => (m.nodes[1].g = "zzz"))).toContain("unknown group");
    expect(broken((m) => (m.nodes[1].col = 9))).toContain("out of range");
    expect(broken((m) => m.nodes.pop() && m.nodes.pop() && m.nodes.pop())).toContain("is empty");
  });
  it("catches edges and flows that point nowhere", () => {
    expect(broken((m) => m.edges.push(["load", "ghost", ""]))).toContain("unknown node");
    expect(broken((m) => m.edges.push(["load", "load", ""]))).toContain("itself");
    expect(broken((m) => m.edges.push(["src1", "load", "again"]))).toContain("repeats");
    expect(broken((m) => (m.flows[0].steps[1][0] = "ghost"))).toContain("unknown node");
    expect(broken((m) => (m.flows[0].steps = m.flows[0].steps.slice(0, 2)))).toContain("3 to 6 steps");
  });
  it("enforces text limits", () => {
    expect(broken((m) => (m.nodes[0].name = "x".repeat(LIMITS.name + 1)))).toContain("name");
    expect(broken((m) => (m.nodes[0].sub = ""))).toContain("sub");
    expect(broken((m) => (m.nodes[0].feat = []))).toContain("feat");
    expect(broken((m) => (m.edges[0][2] = "y".repeat(LIMITS.label + 1)))).toContain("label");
  });
});

describe("map page", () => {
  it("renders one lane per column and one box per node, escaped", () => {
    const m = good();
    m.nodes[0].name = "<b>x</b>";
    const html = mapHTML(certOf("dp600"), m);
    expect((html.match(/class="lane"/g) || []).length).toBe(3);
    expect((html.match(/class="mnode"/g) || []).length).toBe(4);
    expect(html).not.toContain("<b>x</b>");
    expect(html).toContain("&lt;b&gt;x");
  });
});

describe("registered maps", () => {
  it("belong to a real cert and are valid", () => {
    Object.entries(MAPS).forEach(([certId, map]) => {
      expect(CERTS.map((c) => c.id), certId).toContain(certId);
      expect(validateMap(map), certId).toEqual([]);
      expect(map.nodes.length, certId).toBeGreaterThanOrEqual(18);
      expect(map.nodes.length, certId).toBeLessThanOrEqual(30);
      expect(map.edges.length, certId).toBeGreaterThanOrEqual(30);
      expect(map.flows.length, certId).toBeGreaterThanOrEqual(4);
    });
  });
  it("never replaces DP-700's hand-built maps", () => {
    expect(MAPS.dp700).toBeUndefined();
    expect(certOf("dp700").maps).toEqual(["svc", "mon"]);
  });
  it("links consecutive flow steps with an edge", () => {
    Object.entries(MAPS).forEach(([certId, map]) => map.flows.forEach((f) => {
      for (let k = 0; k < f.steps.length - 1; k++) {
        const a = f.steps[k][0], b = f.steps[k + 1][0];
        expect(map.edges.some((e) => (e[0] === a && e[1] === b) || (e[0] === b && e[1] === a)), `${certId} ${f.name}: ${a} -> ${b}`).toBe(true);
      }
    }));
  });
});
