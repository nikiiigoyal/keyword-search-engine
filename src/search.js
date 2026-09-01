// We don't necessarily want punctuation or uppercase differences.

function tokenize(text) {
  return text
  .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/);
}


// search every doc.
function searchDocuments(query, documents) {
  const queryWords = tokenize(query)
  const results = documents.map((document) => {
    const documentText = 
  `${document.title} ${document.content}`.toLowerCase();

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
  .sort((a,b) => b.score - a.score  );
  }

module.exports = { tokenize, searchDocuments };
