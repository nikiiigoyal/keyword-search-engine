# Basic Keyword Search Engine
## Objective

Build a simple keyword-based search engine from scratch to understand
how a retriever can find and rank relevant documents based on keywords.

## In this project
1. Initialize a Node.js project:-
**npm init -y**

2. create a file - **documents.js**
A small database example

3. **index.js** - for user query and all other functionlaities.

4. Run **node index.js**

5. convert the query into keywords. - PROMPT
   ↓
TOKENIZATION
   ↓
KEYWORDS
Next, we need to compare these keywords against every document.

6. Made a search function and use the function in index.js -
 result = score and matched words

7. Rank the docs - filter and sort
8. display clean result

### Limitations -
This basic approach has limitations:
  - Common words like "how", "to", and "an" are not very informative.
  - Simple matching does not account for how many times a word appears.
  - It only works when the query and document use matching words.


