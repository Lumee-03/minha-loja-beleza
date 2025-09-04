// preço unitário do produto (em número)
const unitPrice = 59.90; // ajuste conforme seu produto

const quantityInput = document.getElementById('quantity');
const totalPriceEl = document.getElementById('totalPrice');
const unitPriceEl = document.getElementById('unitPrice');
const buyBtn = document.getElementById('buyBtn');

// formata para BRL
const fmtBRL = (n) => new Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'}).format(n);

// exibe preço unitário
unitPriceEl.textContent = fmtBRL(unitPrice);

// função que atualiza o total
function updateTotal() {
  let q = parseInt(quantityInput.value, 10);
  if (!q || q < 1) { q = 1; quantityInput.value = 1; }
  const total = +(unitPrice * q).toFixed(2);
  totalPriceEl.textContent = fmtBRL(total);
}

// atualiza ao mudar quantidade
quantityInput.addEventListener('input', updateTotal);

// botão Comprar: por enquanto mostra um aviso.
// No próximo passo vamos substituir por um fetch que chama seu backend
buyBtn.addEventListener('click', () => {
  const q = parseInt(quantityInput.value, 10) || 1;
  const total = +(unitPrice * q).toFixed(2);
  alert(`Pedido: ${q}× — Total: ${fmtBRL(total)}\nPróximo passo: gerar preferência no backend e redirecionar para o checkout Mercado Pago.`);
});

// inicializa
updateTotal();
