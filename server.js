import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN; // do Render

app.post("/create_preference", async (req, res) => {
  try {
    const { title, quantity, unitPrice } = req.body;
    const total = unitPrice * quantity;

    const preferenceData = {
      items: [
        {
          title,
          quantity,
          unit_price: total,
        },
      ],
      back_urls: {
        success: "https://seusite.com/success",
        failure: "https://seusite.com/failure",
        pending: "https://seusite.com/pending",
      },
      auto_return: "approved",
    };

    const response = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferenceData),
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar preferência" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
