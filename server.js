const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const documents = require("./documents");
const { searchDocuments, detailedSearch } = require("./src/search");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Endpoint: /api/search?q=query
  if (pathname === "/api/search" && req.method === "GET") {
    const query = parsedUrl.query.q || "";
    const results = detailedSearch(query, documents);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(results));
    return;
  }

  // API Endpoint: /api/documents
  if (pathname === "/api/documents" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(documents));
    return;
  }

  // Serve static files from public/ or root files (documents.js, src/search.js)
  let filePath;
  if (pathname === "/" || pathname === "/index.html") {
    filePath = path.join(PUBLIC_DIR, "index.html");
  } else if (pathname === "/documents.js") {
    filePath = path.join(__dirname, "documents.js");
  } else if (pathname.startsWith("/src/")) {
    filePath = path.join(__dirname, pathname);
  } else {
    filePath = path.join(PUBLIC_DIR, pathname);
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        // Fallback to public/index.html
        fs.readFile(path.join(PUBLIC_DIR, "index.html"), (fallbackErr, fallbackContent) => {
          if (fallbackErr) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("404 Not Found");
          } else {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(fallbackContent, "utf-8");
          }
        });
      } else {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n==============================================`);
  console.log(`🚀 Keyword Search Engine Frontend Server`);
  console.log(`📍 Local URL: http://localhost:${PORT}`);
  console.log(`==============================================\n`);
});
