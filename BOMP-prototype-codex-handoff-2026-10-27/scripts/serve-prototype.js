const fs = require("fs");
const http = require("http");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const port = Number(process.argv[2] || 4173);
const host = process.argv[3] || "127.0.0.1";

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
};

function send(response, statusCode, body, contentType = "text/plain; charset=utf-8") {
  response.writeHead(statusCode, {
    "Cache-Control": "no-store",
    "Content-Type": contentType
  });
  response.end(body);
}

const server = http.createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    send(response, 405, "Method not allowed");
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, `http://${host}:${port}`).pathname);
  } catch (error) {
    send(response, 400, "Bad request");
    return;
  }

  const relativePath = pathname.replace(/^\/+/, "") || "pages/prototype-suite/home.html";
  let filePath = path.resolve(projectRoot, relativePath);
  if (filePath !== projectRoot && !filePath.startsWith(`${projectRoot}${path.sep}`)) {
    send(response, 403, "Forbidden");
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (!statError && stats.isDirectory()) filePath = path.join(filePath, "index.html");

    fs.readFile(filePath, (readError, data) => {
      if (readError) {
        send(response, readError.code === "ENOENT" ? 404 : 500, "File not found");
        return;
      }

      response.writeHead(200, {
        "Cache-Control": "no-store",
        "Content-Type": mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream"
      });
      response.end(request.method === "HEAD" ? undefined : data);
    });
  });
});

server.listen(port, host, () => {
  console.log(`BOMP prototype server: http://${host}:${port}/pages/prototype-suite/home.html`);
  console.log("Press Ctrl+C to stop the server.");
});
