const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../dashboard/dist")));

app.get("/api/hello", (req, res) => {
  res.json({ message: "Olá do backend!" });
});

// Qualquer outro pedido é redirecionado para o frontend (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dashboard/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor a correr em http://localhost:${PORT}`);
});
