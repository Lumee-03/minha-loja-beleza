// Função para formatar em BRL
const fmtBRL = n => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

// Seleciona todos os cards de produto
const productCards = document.querySelectorAll('.product-card');

productCards.forEach(card => {
  const quantityInput = card.querySelector('.quantity');
  const unitPriceEl = card.querySelector('.unitPrice');
  const totalPriceEl = card.querySelector('.totalPrice');
  const buyBtn = card.querySelector('.buyBtn');
  const unitPrice = parseFloat(card.dataset.unitPrice);

  // Mostra preço unitário
  unitPriceEl.textContent = fmtBRL(unitPrice);

  // Função para atualizar total
  function updateTotal() {
    let q = parseInt(quantityInput.value, 10);
    if (!q || q < 1) { q = 1; quantityInput.value = 1; }
    const total = +(unitPrice * q).toFixed(2);
    totalPriceEl.textContent = fmtBRL(total);
  }

  // Atualiza quando muda quantidade
  quantityInput.addEventListener('input', updateTotal);

  // Inicializa total
  updateTotal();

  // Botão comprar
  buyBtn.addEventListener('click', async () => {
    const quantity = parseInt(quantityInput.value, 10) || 1;
    const title = card.querySelector('.product-title').textContent;

    try {
      const response = await fetch('https://minha-loja-beleza.onrender.com/create_preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, quantity, unitPrice })
      });

      const data = await response.json();

      if (data.init_point) {
        window.open(data.init_point, '_blank'); // Abre em nova aba
      } else {
        alert('Erro ao criar preferência de pagamento');
        console.log(data);
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão com o servidor');
    }
  });
});
