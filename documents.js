const documents = [
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

if (typeof module !== "undefined" && module.exports) {
  module.exports = documents;
}
if (typeof window !== "undefined") {
  window.defaultDocuments = documents;
}

