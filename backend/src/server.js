const http = require("node:http");
const {
  createRequest,
  getIntakeTemplate,
  getRequest
} = require("./requestWorkflow");

const port = Number(process.env.PORT || 4201);
const allowedOrigin = process.env.ALLOWED_ORIGIN || "http://localhost:4200";
const store = new Map();

const server = http.createServer(async (request, response) => {
  setCorsHeaders(response);

  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return;
  }

  const url = new URL(request.url, `http://${request.headers.host}`);

  try {
    if (request.method === "GET" && url.pathname === "/health") {
      sendJson(response, 200, { status: "ok", service: "qtcr-concierge-api" });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/concierge/intake-template") {
      sendJson(response, 200, getIntakeTemplate());
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/concierge/requests") {
      const body = await readJsonBody(request);
      const created = createRequest(body, store);
      sendJson(response, 201, { request: created });
      return;
    }

    const requestMatch = url.pathname.match(/^\/api\/concierge\/requests\/([^/]+)$/);
    if (request.method === "GET" && requestMatch) {
      const existing = getRequest(requestMatch[1], store);
      if (!existing) {
        sendJson(response, 404, {
          error: { code: "not_found", message: "Concierge request not found" }
        });
        return;
      }

      sendJson(response, 200, { request: existing });
      return;
    }

    sendJson(response, 404, { error: { code: "not_found", message: "Route not found" } });
  } catch (error) {
    sendJson(response, error.status || 500, {
      error: {
        code: error.code || "internal_error",
        message: error.message || "Unexpected server error"
      }
    });
  }
});

function setCorsHeaders(response) {
  response.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload, null, 2));
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let raw = "";

    request.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        reject(createHttpError(413, "payload_too_large", "Payload exceeds 1 MB"));
        request.destroy();
      }
    });

    request.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(createHttpError(400, "invalid_json", "Request body must be valid JSON"));
      }
    });

    request.on("error", reject);
  });
}

function createHttpError(status, code, message) {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
}

if (require.main === module) {
  server.listen(port, () => {
    console.log(`Qtcr concierge API running at http://localhost:${port}`);
  });
}

module.exports = { server };
