const express = require("express");
const router = express.Router();

// Aqui colocamos os dados hardcoded por agora
const linhas = [
  { id: 1, nome: "Linha A" },
  { id: 2, nome: "Linha B" },
  { id: 3, nome: "Linha C" },
  { id: 4, nome: "Linha D" },
  { id: 5, nome: "Linha E" },
  { id: 6, nome: "Linha F" },
];

router.get("/", (req, res) => {
  res.json(linhas);
});

module.exports = router;