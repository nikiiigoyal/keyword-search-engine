# 🔍 Basic Keyword Search Engine (Stage 1 Retriever)

> **RAG & Information Retrieval Fundamentals — Part 1**  
> A simple keyword-based search engine built from scratch in JavaScript & Node.js, featuring an **interactive visual frontend** demonstrating the full retrieval pipeline: Tokenization ➔ Scoring ➔ Filtering ➔ Ranking.

---

## 🚀 Quick Start

### Option 1: Run Interactive Frontend Server
Start the local server and open the web dashboard:
```bash
npm start
```
Then visit: **[http://localhost:3000](http://localhost:3000)** in your browser.

### Option 2: Open Directly in Browser (No Server Required)
You can simply double-click and open `public/index.html` in any browser!

### Option 3: Run via Terminal CLI
Run the original terminal search script:
```bash
node index.js
# or
npm run cli
```

---

## 🧠 How the Search Pipeline Works Under the Hood

```
   User Query: "How to make pizza without an oven"
                         │
                         ▼
  [Step 1]  TOKENIZATION & NORMALIZATION
            • Lowercase text & strip punctuation
            • Tokens: ["how", "to", "make", "pizza", "without", "an", "oven"]
                         │
                         ▼
  [Step 2]  CORPUS SCANNING & SCORING
            • Iterate each document in corpus (title + content)
            • Count matching tokens: score++ for each match
                         │
                         ▼
  [Step 3]  FILTERING & DESCENDING RANKING
            • Discard documents with score === 0
            • Sort surviving documents: (a, b) => b.score - a.score
                         │
                         ▼
  [Step 4]  RANKED RESULTS OUTPUT
            • 🥇 Rank #1: Doc #2 (Pizza Without Oven) - Score: 7
            • 🥈 Rank #2: Doc #1 (Pizza at Home) - Score: 4
            • 🥉 Rank #3: Doc #4 (Cooking Pasta) - Score: 2
```

---

## ⚠️ What's the Problem in This? (Limitations of Basic Keyword Search)

While this basic search engine works for exact token containment, it has critical shortcomings when used in real-world Retrieval-Augmented Generation (RAG) systems:

| Problem / Flaw | Description | Example / Demonstration |
|---|---|---|
| **1. Stop Words Domination** | Common grammatical words like *"how"*, *"to"*, *"an"*, *"the"* contribute equal score as critical topic keywords like *"pizza"* or *"oven"*. | Querying `"how to"` matches every single document equally without expressing topic intent. |
| **2. Term Frequency Ignorance** | Mentioning a keyword 10 times in a document yields the same score (+1) as mentioning it once. No term saturation or document length normalization. | Missing **TF-IDF** / **BM25** term frequency scoring. |
| **3. Vocabulary Mismatch (Zero Semantics)** | The engine cannot understand synonyms, related concepts, or typos. | Searching `"baking chocolate pastry"` yields **0 results**, even though *"Chocolate Cake"* is in the corpus! |
| **4. Substring False Positives** | Using JavaScript `includes()` causes short words like `"an"` to match inside `"pan"` or `"banana"`. | Querying `"an"` matches Doc #2 via `"pan"`. |

---

## 🗺️ Roadmap: The Journey to Advanced Search & RAG

- **Stage 1 (Current)**: Naive Exact Keyword Matching & Count Scoring.
- **Stage 2 (Next)**: Stop Words Filtering & Stemming (Porter Stemmer).
- **Stage 3**: Probabilistic Keyword Retrieval with **TF-IDF** & **BM25**.
- **Stage 4**: Dense Vector Embeddings & Semantic Search (Cosine Similarity with Vector DBs).
- **Stage 5 (Production RAG)**: Hybrid Search (BM25 + Dense Vectors) + Cross-Encoder Reranker.

---

## 📁 Project Structure

```
keyword-search-engine/
├── index.js             # Terminal CLI entry point
├── server.js            # Zero-dependency local HTTP & API server
├── documents.js         # Sample document corpus
├── package.json         # Project metadata and run scripts
├── README.md            # Project documentation
├── src/
│   └── search.js        # Core search algorithms (tokenize, searchDocuments, detailedSearch)
└── public/
    ├── index.html       # Interactive visualizer dashboard
    ├── style.css        # Responsive developer theme
    └── app.js           # Real-time search UI controller & flaw triggers
```


