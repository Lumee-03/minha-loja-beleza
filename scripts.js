// Preço unitário do produto
const unitPrice = 59.90;

const quantityInput = document.getElementById('quantity');
const totalPriceEl = document.getElementById('totalPrice');
const unitPriceEl = document.getElementById('unitPrice');
const buyBtn = document.getElementById('buyBtn');

// Função para formatar em BRL
const fmtBRL = n => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

// Mostra o preço unitário
unitPriceEl.textContent = fmtBRL(unitPrice);

// Atualiza o total
function updateTotal() {
  let q = parseInt(quantityInput.value, 10);
  if (!q || q < 1) { q = 1; quantityInput.value = 1; }
  const total = +(unitPrice * q).toFixed(2);
  totalPriceEl.textContent = fmtBRL(total);
}

// Atualiza quando muda a quantidade
quantityInput.addEventListener('input', updateTotal);

// Inicializa
updateTotal();

// Botão comprar
buyBtn.addEventListener('click', () => {
  const q = parseInt(quantityInput.value, 10) || 1;
  const total = +(unitPrice * q).toFixed(2);

  // Chama o backend no Render
  fetch("https://minha-loja-beleza.onrender.com/create_preference", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Sérum Iluminador",
      quantity: q,
      unitPrice: unitPrice
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.init_point) {
        // Redireciona para o checkout do Mercado Pago
        window.location.href = data.init_point;
      } else {
        alert("Erro ao gerar link de pagamento");
        console.log(data);
      }
    })
    .catch(err => {
      alert("Erro de conexão com o servidor");
      console.error(err);
    });
});
