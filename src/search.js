function tokenize(text) {
  return text
  .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/);
}
module.exports = { tokenize };

// We don't necessarily want punctuation or uppercase differences.
