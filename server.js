// JSON Server module
const jsonServer = require("json-server");
const server = jsonServer.create();
const auth = require("json-server-auth");
const path = require("path");
const fs = require("fs");
const db = JSON.parse(fs.readFileSync(path.join(__dirname, "./db.json")));
const router = jsonServer.router(db);

// Make sure to use the default middleware
const middlewares = jsonServer.defaults();
server.use(middlewares);

// Add this before server.use(router)
server.use(
  // Add custom route here if needed
  auth.rewriter({
    "/api/*": "/$1",
  })
);

server.get("/users", (req, res, next) => {
  if (
    req.path.startsWith("/users") &&
    req.headers["authorization"] !== "Bearer abcd"
  ) {
    return res.status(401).json({ error: "Must pass bearer token abcd" });
  }
  next();
});

// /!\ Bind the router db to the app
server.db = router.db;

server.use(auth);
server.use(router);
// Listen to port
server.listen(5000, () => {
  console.log("JSON Server is running");
});

// Export the Server API
module.exports = server;
