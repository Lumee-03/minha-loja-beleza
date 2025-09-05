async function loadProducts() {
  const res = await fetch('produtos.json');
  const produtos = await res.json();
  const list = document.getElementById('product-list');
  if (!list) return;

  produtos.forEach(p => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow p-4 hover:shadow-lg transition';

    card.innerHTML = `
      <a href="produto.html?id=${p.id}">
        <img src="${p.image}" class="rounded-lg mb-4 w-full">
        <h3 class="text-xl font-semibold mb-2">${p.title}</h3>
      </a>
      <p class="text-pink-500 font-bold mb-3">R$ ${p.price.toFixed(2)}</p>
      <div class="flex gap-2">
        <a href="produto.html?id=${p.id}" 
           class="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-300">
           Detalhes
        </a>
        <button data-id="${p.id}" 
                class="bg-pink-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-pink-600">
           Comprar
        </button>
      </div>
    `;

    list.appendChild(card);
  });

  // Botão Comprar direto
  document.querySelectorAll('button[data-id]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.getAttribute('data-id');
      const produto = produtos.find(p => p.id === id);

      if (!produto) return alert("Produto não encontrado");

      const response = await fetch('https://minha-loja-beleza.onrender.com/create_preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: produto.title, 
          quantity: 1, 
          unitPrice: produto.price 
        })
      });

      const data = await response.json();
      if (data.init_point) {
        window.open(data.init_point, '_blank'); // abre em nova aba
      } else {
        alert('Erro ao criar preferência de pagamento');
      }
    });
  });
}

async function loadProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) return;

  const res = await fetch('produtos.json');
  const produtos = await res.json();
  const produto = produtos.find(p => p.id === id);

  if (!produto) return;

  document.getElementById('product-title').textContent = produto.title;
  document.getElementById('product-desc').textContent = produto.desc;
  document.getElementById('product-image').src = produto.image;
  document.getElementById('product-price').textContent = `R$ ${produto.price.toFixed(2)}`;

  const buyBtn = document.getElementById('buyBtn');
  buyBtn.addEventListener('click', async () => {
    const quantity = parseInt(document.getElementById('quantity').value) || 1;

    const response = await fetch('https://minha-loja-beleza.onrender.com/create_preference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        title: produto.title, 
        quantity, 
        unitPrice: produto.price 
      })
    });

    const data = await response.json();
    if (data.init_point) {
      window.open(data.init_point, '_blank');
    } else {
      alert('Erro ao criar preferência de pagamento');
    }
  });
}

// Executa
loadProducts();
loadProductDetail();
