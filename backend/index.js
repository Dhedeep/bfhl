const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 YOUR DETAILS (edit only here)
const USER_ID = "dhedeep_17092003";
const EMAIL_ID = "dp7933@srmist.edu.in";
const COLLEGE_ROLL = "RA2311026020098";

// Helper: validate edge
const isValidEdge = (str) => /^[A-Z]->[A-Z]$/.test(str);

// POST API
app.post("/bfhl", (req, res) => {
  const input = req.body.data || [];

  let invalid_entries = [];
  let duplicate_edges = [];
  let seen = new Set();
  let graph = {};
  let childParent = {};

  for (let item of input) {

    // ❌ invalid format
    if (!isValidEdge(item)) {
      invalid_entries.push(item);
      continue;
    }

    let [u, v] = item.split("->");

    // ❌ self loop
    if (u === v) {
      invalid_entries.push(item);
      continue;
    }

    // ❌ duplicate
    if (seen.has(item)) {
      if (!duplicate_edges.includes(item)) {
        duplicate_edges.push(item);
      }
      continue;
    }
    seen.add(item);

    // ❌ diamond rule (only one parent allowed)
    if (childParent[v]) continue;
    childParent[v] = u;

    if (!graph[u]) graph[u] = [];
    graph[u].push(v);
  }

  // 🔍 DFS to calculate depth
  const getDepth = (node) => {
    if (!graph[node]) return 1;

    let max = 0;
    for (let child of graph[node]) {
      max = Math.max(max, getDepth(child));
    }
    return 1 + max;
  };

  // 🔍 find all nodes
  let nodes = new Set();
  Object.keys(graph).forEach(k => {
    nodes.add(k);
    graph[k].forEach(v => nodes.add(v));
  });

  // 🔍 find roots (no parent)
  let roots = [...nodes].filter(n => !childParent[n]);

  let bestRoot = "";
  let maxDepth = 0;

  for (let r of roots) {
    let d = getDepth(r);

    if (d > maxDepth || (d === maxDepth && r < bestRoot)) {
      maxDepth = d;
      bestRoot = r;
    }
  }

  // ✅ FINAL RESPONSE
  res.json({
    user_id: USER_ID,
    email: EMAIL_ID,
    roll_number: COLLEGE_ROLL,
    invalid_entries,
    duplicate_edges,
    root: bestRoot,
    depth: maxDepth
  });
});

// 🚀 Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});