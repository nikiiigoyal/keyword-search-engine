const documents = require("./documents");
const { tokenize } = require("./src/search");
const query = "How to make pizza without an oven";

// Convert the query into keywords
const keywords = tokenize(query);
console.log("Keywords:", keywords);

// search every document

const results = documents.map((document) => {
const text = document.content.toLowerCase();
 let score = 0;
 keywords.forEach((keyword) => {
  if (text.includes(keyword)) {
    score ++;
  }
 })
return {
  ...document,
  score
}

})
results.sort((a, b) => b.score - a.score);
console.log("\nSearch Results:\n");
results.forEach((result) => {
console.log(`Score: ${result.score} | ${result.title}`)
})

