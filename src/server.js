const http = require("http");

const claims = {
  CLM9001: { status: "OPEN", amount: 1200 },
  CLM9002: { status: "APPROVED", amount: 450 },
};

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.url === "/health") {
    res.end(JSON.stringify({ status: "ok", service: "claims-service" }));
    return;
  }

  const match = req.url && req.url.match(/^\/v1\/claims\/([A-Z0-9]+)$/);
  if (match) {
    const claim = claims[match[1]];
    if (!claim) {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "not_found" }));
      return;
    }
    res.end(JSON.stringify({ id: match[1], ...claim }));
    return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: "route_not_found" }));
});

server.listen(8080, () => {
  console.log("claims-service listening on :8080");
});