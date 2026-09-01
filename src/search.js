// We don't necessarily want punctuation or uppercase differences.

function tokenize(text) {
  if (!text || typeof text !== "string") return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 0);
}

// search every doc.
function searchDocuments(query, documents) {
  const queryWords = tokenize(query);
  if (queryWords.length === 0) return [];

  const results = documents.map((document) => {
    const documentText = `${document.title} ${document.content}`.toLowerCase();

    let score = 0;
    const matchedWords = [];

    queryWords.forEach((word) => {
      if (documentText.includes(word)) {
        score++;
        matchedWords.push(word);
      }
    });

    return {
      ...document,
      score,
      matchedWords
    };
  });

  return results
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score);
}

// Detailed step-by-step search pipeline for interactive UI and visualizer
function detailedSearch(query, documents) {
  const cleanQuery = query ? query.trim() : "";
  const queryWords = tokenize(cleanQuery);

  const scannedDocs = documents.map((doc) => {
    const documentText = `${doc.title} ${doc.content}`.toLowerCase();
    const matchedWords = [];
    const unmatchedWords = [];
    let score = 0;

    queryWords.forEach((word) => {
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

  const filteredDocs = scannedDocs.filter((result) => result.score > 0);
  const rankedResults = [...filteredDocs].sort((a, b) => b.score - a.score);

  return {
    rawQuery: query,
    tokens: queryWords,
    scannedDocs,
    filteredDocs,
    rankedResults
  };
}

// Universal export for Node.js (CommonJS) and Browser
if (typeof module !== "undefined" && module.exports) {
  module.exports = { tokenize, searchDocuments, detailedSearch };
}
if (typeof window !== "undefined") {
  window.SearchEngine = { tokenize, searchDocuments, detailedSearch };
}

