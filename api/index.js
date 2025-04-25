const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "../dashboard/dist")));


// Rota fallback SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dashboard/dist/index.html"));
});

// Start do servidor
app.listen(PORT, () => {
  console.log(`Servidor a correr em http://localhost:${PORT}`);
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error("Error occurred:", err);
  res.status(500).send("Something went wrong!");
});