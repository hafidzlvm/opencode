# Graphify Workflow (knowledge graph repo)

Precedence: Security (INSTRUCTIONS.md) > `00-workflow.md` > file ini.

Graph sudah jadi di `graphify-out/` (9664 nodes, 753 communities). Pakai graph untuk jawab pertanyaan codebase, bukan grep buta.

## 1. Kapan pakai graph

- Pertanyaan arsitektur / "how does X work" / "what calls Y" / trace alur data → query graph dulu.
- Ada `graphify-out/graph.json` → JANGAN rebuild, langsung `query` / `path` / `explain`.
- Rebuild hanya jika: kode berubah banyak, diminta eksplisit, atau `--update` / `--cluster-only`.

## 2. Query (BFS default, DFS untuk rantai)

```bash
graphify query "<pertanyaan>"
graphify query "<pertanyaan>" --dfs          # trace rantai spesifik X→Y
graphify query "<pertanyaan>" --budget 1500  # batasi output
```

Aturan:

1. Expand query ke vocab graph dulu (maks 12 token dari label node asli, jangan mengarang sinonim).
2. Tulis `Query expanded to (from graph vocab): [...]` biar auditable.
3. Jawab hanya dari isi graph + kutip `source_location`. Kurang info → katakan, jangan halusinasi edge.

## 3. Path & explain

```bash
graphify path "<NodeA>" "<NodeB>"   # shortest path antar konsep
graphify explain "<NodeName>"       # semua koneksi 1 node, 3-5 kalimat
```

## 4. Update inkremental (jangan full rebuild)

```bash
/graphify <path> --update       # hanya file baru/berubah (baca manifest)
/graphify <path> --cluster-only # ulangi clustering saja
```

## 5. Feedback loop (wajib setelah jawab)

```bash
$(cat graphify-out/.graphify_python) -m graphify save-result --question "<asli>" --answer "<jawaban + expanded tokens>" --type query --nodes <Node1> <Node2> --outcome useful|dead_end|corrected
graphify reflect --if-stale  # baca graphify-out/reflections/LESSONS.md di awal sesi
```

## 6. Output & batas

- `graphify-out/graph.html` (community view, >5000 nodes teragregasi), `GRAPH_REPORT.md`, `graph.json`.
- Jangan commit artifact graph (`graph.html`/`graph.json`, belasan MB) → masuk `.gitignore`. `manifest.json` + `cost.json` boleh ikut (murah, untuk `--update`).
- Graph basi setelah >~10 file berubah → `/graphify <path> --update` di awal sesi.
- Health warning (dangling/collapsed edges) → tampilkan di ringkasan, jangan abort.
- Full build mahal (contoh: 1141 file / 2.6M kata → 17 chunk ekstraksi). Korpus >500 file / >2M kata → tawarkan subfolder dulu.
