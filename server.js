import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch"; // npm install node-fetch

const app = express();
const PORT = process.env.PORT || 10000;

// Ativa CORS para qualquer origem
app.use(cors());
app.use(bodyParser.json());

// Endpoint de teste
app.get("/", (req, res) => {
  res.send("Servidor rodando!");
});

// Endpoint para criar preferência do Mercado Pago
app.post("/create_preference", async (req, res) => {
  const { title, quantity, unitPrice } = req.body;

  if (!title || !quantity || !unitPrice) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  const access_token = process.env.ACCESS_TOKEN;
  if (!access_token) {
    return res.status(500).json({ error: "Token do Mercado Pago não configurado" });
  }

  const preference = {
    items: [
      {
        title,
        quantity,
        unit_price: Number(unitPrice),
        currency_id: "BRL"
      }
    ],
    back_urls: {
      success: "https://seusite.com/sucesso",
      failure: "https://seusite.com/falha",
      pending: "https://seusite.com/pending"
    },
    auto_return: "approved"
  };

  try {
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`
      },
      body: JSON.stringify(preference)
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar preferência", detalhes: err.message });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
