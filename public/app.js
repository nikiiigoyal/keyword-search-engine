// Initial documents fallback if not already loaded
const DEFAULT_DOCUMENTS = [
  {
    id: 1,
    title: "Pizza at Home",
    content: "How to make pizza at home using simple ingredients."
  },
  {
    id: 2,
    title: "Pizza Without Oven",
    content: "How to make pizza without an oven using a pan."
  },
  {
    id: 3,
    title: "Chocolate Cake",
    content: "A simple recipe to make chocolate cake at home."
  },
  {
    id: 4,
    title: "Cooking Pasta",
    content: "How to cook delicious pasta with vegetables."
  }
];

// Application state
let currentDocuments = [];
if (typeof window !== "undefined" && window.defaultDocuments && Array.isArray(window.defaultDocuments)) {
  currentDocuments = JSON.parse(JSON.stringify(window.defaultDocuments));
} else {
  currentDocuments = JSON.parse(JSON.stringify(DEFAULT_DOCUMENTS));
}

// Fallback search functions in case search.js is loaded standalone
function localTokenize(text) {
  if (!text || typeof text !== "string") return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

function localDetailedSearch(query, docs) {
  const cleanQuery = query ? query.trim() : "";
  const tokens = (window.SearchEngine && window.SearchEngine.tokenize) 
    ? window.SearchEngine.tokenize(cleanQuery) 
    : localTokenize(cleanQuery);

  const scannedDocs = docs.map((doc) => {
    const documentText = `${doc.title} ${doc.content}`.toLowerCase();
    const matchedWords = [];
    const unmatchedWords = [];
    let score = 0;

    tokens.forEach((word) => {
      if (documentText.includes(word)) {
        score++;
        matchedWords.push(word);
      } else {
        unmatchedWords.push(word);
      }
    });

    return {
      ...doc,
      documentText,
      score,
      matchedWords,
      unmatchedWords
    };
  });

  const filteredDocs = scannedDocs.filter((d) => d.score > 0);
  const rankedResults = [...filteredDocs].sort((a, b) => b.score - a.score);

  return {
    rawQuery: query,
    tokens,
    scannedDocs,
    filteredDocs,
    rankedResults
  };
}

// DOM Elements
const queryInput = document.getElementById("queryInput");
const clearBtn = document.getElementById("clearBtn");
const rawQueryDisplay = document.getElementById("rawQueryDisplay");
const tokenChipsList = document.getElementById("tokenChipsList");
const tokenCount = document.getElementById("tokenCount");
const corpusScanGrid = document.getElementById("corpusScanGrid");
const filteringVisual = document.getElementById("filteringVisual");
const finalResultsContainer = document.getElementById("finalResultsContainer");
const documentsListGrid = document.getElementById("documentsListGrid");

const addDocBtn = document.getElementById("addDocBtn");
const resetDocsBtn = document.getElementById("resetDocsBtn");
const addDocForm = document.getElementById("addDocForm");
const saveDocBtn = document.getElementById("saveDocBtn");
const cancelDocBtn = document.getElementById("cancelDocBtn");
const newDocTitle = document.getElementById("newDocTitle");
const newDocContent = document.getElementById("newDocContent");

// Helper: Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Helper: Highlight matched keywords in text
function highlightText(text, matchedWords) {
  if (!matchedWords || matchedWords.length === 0) return escapeHtml(text);
  
  // Sort matched words by length descending so longer words match first
  const uniqueWords = Array.from(new Set(matchedWords.map((w) => w.toLowerCase()))).sort((a, b) => b.length - a.length);
  
  // Regex pattern matching whole words or substrings
  const regex = new RegExp(`(${uniqueWords.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  
  return escapeHtml(text).replace(regex, '<mark>$1</mark>');
}

// Main function to run search and update the UI
function runSearch() {
  const query = queryInput.value;
  const searchResult = (window.SearchEngine && window.SearchEngine.detailedSearch) 
    ? window.SearchEngine.detailedSearch(query, currentDocuments) 
    : localDetailedSearch(query, currentDocuments);

  updateStep1(searchResult);
  updateStep2(searchResult);
  updateStep3(searchResult);
  updateStep4(searchResult);
}

// Step 1: Tokenization UI
function updateStep1(result) {
  rawQueryDisplay.textContent = result.rawQuery ? `"${result.rawQuery}"` : '""';
  tokenCount.textContent = result.tokens.length;

  if (result.tokens.length === 0) {
    tokenChipsList.innerHTML = `<span class="text-muted" style="font-size:0.85rem; color:#64748b;">(No valid keywords extracted)</span>`;
    return;
  }

  tokenChipsList.innerHTML = result.tokens.map((token, idx) => `
    <span class="token-badge">
      <span class="token-index">#${idx + 1}</span>
      "${escapeHtml(token)}"
    </span>
  `).join("");
}

// Step 2: Corpus Scanning & Scoring UI
function updateStep2(result) {
  if (!result.scannedDocs || result.scannedDocs.length === 0) {
    corpusScanGrid.innerHTML = `<p style="color:#94a3b8; font-size:0.9rem;">No documents in corpus.</p>`;
    return;
  }

  corpusScanGrid.innerHTML = result.scannedDocs.map((doc) => {
    const hasMatch = doc.score > 0;
    const cardClass = hasMatch ? "doc-scan-card has-match" : "doc-scan-card no-match";
    const scoreClass = hasMatch ? "score-badge positive" : "score-badge zero";

    const matchedTagsHtml = doc.matchedWords.map((w) => `<span class="match-tag matched">✓ ${escapeHtml(w)}</span>`).join("");
    const unmatchedTagsHtml = doc.unmatchedWords.map((w) => `<span class="match-tag unmatched">✗ ${escapeHtml(w)}</span>`).join("");

    return `
      <div class="${cardClass}">
        <div>
          <div class="doc-card-top">
            <span class="doc-card-title">${escapeHtml(doc.title)}</span>
            <span class="doc-id-badge">Doc #${doc.id}</span>
          </div>
          <div class="doc-text-sample">"${escapeHtml(doc.content)}"</div>
        </div>
        
        <div class="match-eval-wrap">
          <div class="match-tags-list">
            ${matchedTagsHtml || ''}
            ${unmatchedTagsHtml || ''}
            ${doc.matchedWords.length === 0 && doc.unmatchedWords.length === 0 ? '<span class="text-muted" style="font-size:0.75rem;">No query keywords to compare</span>' : ''}
          </div>
          <div class="doc-score-row">
            <span style="font-size:0.78rem; color:#94a3b8;">Matches: ${doc.matchedWords.length}/${result.tokens.length}</span>
            <span class="${scoreClass}">Score: ${doc.score}</span>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// Step 3: Filtering & Sorting UI
function updateStep3(result) {
  const totalScanned = result.scannedDocs.length;
  const passedCount = result.filteredDocs.length;
  const discardedCount = totalScanned - passedCount;

  filteringVisual.innerHTML = `
    <div class="filtering-stats">
      <div class="stat-item">
        <span>Scanned:</span>
        <span class="stat-val">${totalScanned}</span>
      </div>
      <div class="stat-item">
        <span>Passed (Score > 0):</span>
        <span class="stat-val" style="color: #2b7a78;">${passedCount}</span>
      </div>
      <div class="stat-item">
        <span>Discarded (Score = 0):</span>
        <span class="stat-val" style="color: #db2777;">${discardedCount}</span>
      </div>
    </div>
    <div class="sorting-formula">
      <strong>Ranking Strategy:</strong> <code>.sort((a, b) => b.score - a.score)</code> — Documents with the highest number of keyword containment matches are ranked first.
    </div>
  `;
}

// Step 4: Final Results UI
function updateStep4(result) {
  if (result.rankedResults.length === 0) {
    finalResultsContainer.innerHTML = `
      <div class="no-results-box">
        <div class="no-results-icon">🔎</div>
        <h4 style="margin-bottom:0.4rem; color:var(--text-navy); font-weight:800;">No Matching Documents Found</h4>
        <p style="font-size:0.9rem; max-width:480px; margin:0 auto; color:var(--text-secondary);">
          None of the tokenized keywords matched the documents in the corpus. Try typing words like <em>pizza</em>, <em>cake</em>, <em>pasta</em>, or <em>oven</em>.
        </p>
      </div>
    `;
    return;
  }

  finalResultsContainer.innerHTML = result.rankedResults.map((doc, idx) => {
    let rankClass = "rank-other";
    let rankLabel = `#${idx + 1}`;
    if (idx === 0) { rankClass = "rank-1"; rankLabel = "🥇 #1"; }
    else if (idx === 1) { rankClass = "rank-2"; rankLabel = "🥈 #2"; }
    else if (idx === 2) { rankClass = "rank-3"; rankLabel = "🥉 #3"; }

    const highlightedTitle = highlightText(doc.title, doc.matchedWords);
    const highlightedContent = highlightText(doc.content, doc.matchedWords);
    const matchedBadges = doc.matchedWords.map((w) => `<span class="token-badge" style="font-size:0.75rem; padding:0.15rem 0.45rem;">${escapeHtml(w)}</span>`).join(" ");

    return `
      <div class="ranked-result-card ${rankClass}">
        <div class="rank-badge-col">
          <div class="rank-pill">${rankLabel}</div>
        </div>
        <div class="result-content-col">
          <div class="result-header-row">
            <span class="result-title">${highlightedTitle}</span>
            <span class="score-badge positive">Relevance Score: ${doc.score}</span>
          </div>
          <div class="result-snippet">${highlightedContent}</div>
          <div class="result-meta-row">
            <span class="matched-keywords-label">Matched Keywords:</span>
            <div>${matchedBadges}</div>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// Render Document List in Corpus Section
function renderCorpusList() {
  documentsListGrid.innerHTML = currentDocuments.map((doc) => `
    <div class="corpus-doc-card">
      <h4>${escapeHtml(doc.title)}</h4>
      <p>"${escapeHtml(doc.content)}"</p>
      <div style="margin-top:0.5rem; font-size:0.72rem; color:#64748b;">ID: #${doc.id}</div>
    </div>
  `).join("");
}

// Event Listeners
queryInput.addEventListener("input", runSearch);

clearBtn.addEventListener("click", () => {
  queryInput.value = "";
  queryInput.focus();
  runSearch();
});

// Sample Query Chips
document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    queryInput.value = chip.getAttribute("data-query");
    runSearch();
    window.scrollTo({ top: 120, behavior: 'smooth' });
  });
});

// Test Flaw Limitation Buttons
document.querySelectorAll(".test-flaw-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const q = btn.getAttribute("data-query");
    queryInput.value = q;
    runSearch();
    window.scrollTo({ top: 120, behavior: 'smooth' });
  });
});

// Add Document Toggle
addDocBtn.addEventListener("click", () => {
  addDocForm.classList.remove("hidden");
  newDocTitle.focus();
});

cancelDocBtn.addEventListener("click", () => {
  addDocForm.classList.add("hidden");
  newDocTitle.value = "";
  newDocContent.value = "";
});

// Save Custom Document
saveDocBtn.addEventListener("click", () => {
  const title = newDocTitle.value.trim();
  const content = newDocContent.value.trim();

  if (!title || !content) {
    alert("Please provide both a Title and Content for the new document.");
    return;
  }

  const newDoc = {
    id: currentDocuments.length > 0 ? Math.max(...currentDocuments.map((d) => d.id)) + 1 : 1,
    title,
    content
  };

  currentDocuments.push(newDoc);
  newDocTitle.value = "";
  newDocContent.value = "";
  addDocForm.classList.add("hidden");

  renderCorpusList();
  runSearch();
});

// Reset Documents
resetDocsBtn.addEventListener("click", () => {
  currentDocuments = JSON.parse(JSON.stringify(DEFAULT_DOCUMENTS));
  renderCorpusList();
  runSearch();
});

// Initial startup
renderCorpusList();
runSearch();
