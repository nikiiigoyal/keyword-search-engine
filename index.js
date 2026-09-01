const documents = require("./documents");
const {searchDocuments} = require("./src/search");  
const query = "How to make pizza without an oven";

const results = searchDocuments(query, documents);
console.log(`\nSearch Query: ${query}\n`)

results.forEach((result, index) => {
console.log(`${index + 1}, ${result.title}`);
console.log(`Title: ${result.title}`);
console.log(`Score: ${result.score}`);
console.log(`Matched words: ${result.matchedWords.join(", ")}`);
console.log();
});
