// server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Coloque aqui seu Access Token do Mercado Pago (use um .env no deploy)
const ACCESS_TOKEN = "SEU_ACCESS_TOKEN";

app.post("/create_preference", async (req, res) => {
  try {
    const { quantity, unitPrice, title } = req.body;

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        items: [
          {
            title: title,
            quantity: quantity,
            unit_price: unitPrice,
            currency_id: "BRL"
          }
        ]
      })
    });

    const data = await response.json();
    res.json({ url: data.init_point }); // link para redirecionar
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar preferência" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
