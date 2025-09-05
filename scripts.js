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

// Botão comprar (agora chama o backend Render)
buyBtn.addEventListener('click', async () => {
  const quantity = parseInt(quantityInput.value, 10) || 1;
  const title = document.querySelector('.product-title').textContent;

  try {
    const response = await fetch('https://minha-loja-beleza.onrender.com/create_preference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, quantity, unitPrice })
    });

    const data = await response.json();

    if (data.init_point) {
      // Redireciona para checkout Mercado Pago
      window.location.href = data.init_point;
    } else {
      alert('Erro ao criar preferência de pagamento');
      console.log(data);
    }
  } catch (err) {
    console.error(err);
    alert('Erro de conexão com o servidor');
  }
});
