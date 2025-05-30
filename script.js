const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

// Abrir  o modal do carrinho
cartBtn.addEventListener("click", function () {
  updateCartModal();
  cartModal.style.display = "flex";
});

//Fechar o modal quando clicar fora
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

document.addEventListener("keydown", function (event){
  if (event.key === "Escape"){
    cartModal.style.display = "none"
  }
})

 // Adicionar produto ao carrinho
menu.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".add-to-cart-btn");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));

    addToCart(name, price);
  }
});

//Função para adicionar no carrinho

function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updateCartModal();
}

//Atualiza o carrinho 

function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );

    cartItemElement.innerHTML = `
    <div class= "flex items-center justify-between">
      <div>
      <p class="font-bold">${item.name}</p>
      <p> Qtd:${item.quantity}</p>
      <p class="font-bold mt-2">R$${item.price.toFixed(2)}</p>
      </div>

      <div class= "flex flex-col gap-2"> 
        <button class= "add-btn px-2 py-1 rounded" data-name="${item.name}"> + </button>
        <button class="remove-btn" data-name="${item.name}"> Remover </button>
        <button class="subtract-btn px-2 py-1 rounded" data-name="${item.name}"> - </button>
        
      </div>
    </div>`;

    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCounter.innerHTML = totalItems;
}

// Função remover o item do carrinho

cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-btn")) {
    const name = event.target.getAttribute("data-name");
    removeItemCart(name);
  } else if (event.target.classList.contains("add-btn")){
    const name = event.target.getAttribute("data-name")
    addItemCart(name)
  } else if (event.target.classList.contains("subtract-btn")) {
    const name = event.target.getAttribute("data-name")
    subtractItemCart(name)
  }
});

function removeItemCart(name){
  cart = cart.filter(item => item.name !== name)
    updateCartModal()
  }

function addItemCart(name){
  const item = cart.find(item => item.name === name)
  if (item) {
    item.quantity += 1
    updateCartModal()
  }
}

function subtractItemCart(name) {
  const item = cart.find(item => item.name === name)
  if (item) {
    if (item.quantity > 1) {
      item.quantity -= 1
    } else{
      cart = cart.filter(i => i.name !== name)
    }
    updateCartModal()
  }
}
// function removeItemCart(name) {
//   const index = cart.findIndex((item) => item.name === name);

//   if (index !== -1) {
//     const item = cart[index];

//     if (item.quantity > 1) {
//       item.quantity -= 1;
//       updateCartModal();
//       return;
//     }

//     cart.splice(index, 1);
//     updateCartModal();
//   }
// }

    //validação do endereço
addressInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;

  if (inputValue !== "") {
    addressWarn.classList.add("hidden");
    addressInput.classList.remove("border-red-500");
  }
});

//Finalizar pedido
checkoutBtn.addEventListener("click", function () {
  const isOpen = checkLanchoneteOpen();
  if (!isOpen) {
    Toastify({
      text: "A lanchonete está fechada!!",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#FF0000",
      },
    }).showToast()

    return;
  }

  if (cart.length === 0) return;
  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  }

  //Enviar o pedido para api whatsApp

  const cartItems = cart
    .map((item) => {
      return ` ${item.name} | Quantidade: (${item.quantity}) | Preço R$ ${item.price} |`;
    })
    .join("\n");

  const message = encodeURIComponent(
    `Itens do pedido:\n ${cartItems} \n\nEndereço: ${addressInput.value}`
  );
  const phone = "+558586580864";

  window.open(
    `https://wa.me/${phone}?text=${message},`,
    "_blank"
  );

  cart = []; // Limpa o carrinho após enviar a mensagem.
  updateCartModal();
});

//Verifica a hora e manipular o horário

function checkLanchoneteOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 17 && hora < 23;
}

const spanItem = document.getElementById("date-span");
const isOpen = checkLanchoneteOpen();

if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600");
} else {
  spanItem.classList.remove("bg-green-600");
  spanItem.classList.add("bg-red-500");
}
