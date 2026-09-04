// We don't necessarily want punctuation or uppercase differences.

function tokenize(text) {
  if (!text || typeof text !== "string") return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 0);
}
function countOccurrences(text, word) {
  const words = tokenize(text);

  return words.filter(
    (currentWord) => currentWord === word
  ).length;
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
      // // Does the word exixt
      // if (documentText.includes(word)) {
      //   score++;
      //   matchedWords.push(word);
      // }
      // Now we want to count the occurrences of the word
      
 const frequency = countOccurrences(documentText, word);

      if (frequency > 0) {
        score += frequency;

        matchedWords.push({
          word,
          frequency
        });
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

  // Tokenize query and remove duplicate words
  const queryWords = [...new Set(tokenize(cleanQuery))];

  const scannedDocs = documents.map((doc) => {
    const documentText = `${doc.title} ${doc.content}`;

    const matchedWords = [];
    const unmatchedWords = [];
    let score = 0;

    queryWords.forEach((word) => {
      const frequency = countOccurrences(documentText, word);

      if (frequency > 0) {
        score += frequency;

        matchedWords.push({
          word,
          frequency
        });
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

  const filteredDocs = scannedDocs.filter(
    (result) => result.score > 0
  );

  const rankedResults = [...filteredDocs].sort(
    (a, b) => b.score - a.score
  );

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
  module.exports = { tokenize, searchDocuments, detailedSearch , countOccurrences

  } };

if (typeof window !== "undefined") {
  window.SearchEngine = { tokenize, searchDocuments, detailedSearch };
}


