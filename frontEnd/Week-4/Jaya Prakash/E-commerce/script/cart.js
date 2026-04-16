const cart = JSON.parse(localStorage.getItem(`cart-${user.id}`));
const parentCartDiv = document.getElementById("mainCartBody");
// {"products":[{"id":1,"quantity":3},{"id":1,"quantity":3}]}
function iterateingProducts(data) {
  let childDiv = document.createElement("div");
  childDiv.classList.add("card", "bg-low-opacity", "text-white", "border");
  childDiv.style.width = "18rem";

  let cardImg = document.createElement("img");
  cardImg.src = data.img;
  cardImg.classList.add("card-img-top");
  cardImg.alt = "product-img";
  cardImg.height = "250";

  let cardBody = document.createElement("div");
  cardBody.classList.add("card-body", "d-flex", "flex-column");

  let cardTitle = document.createElement("h5");
  cardTitle.classList.add("card-title");
  cardTitle.textContent = data.title;

  let cardPrice = document.createElement("span");
  cardPrice.classList.add("fs-6", "me-4", "my-2", "text-success");
  let priceInRupee = Math.round(data.price * 93.81);
  cardPrice.textContent = "₹. " + priceInRupee;

  let cardInstock = document.createElement("div");
  cardInstock.classList.add(
    "fs-6",
    "text-white",
    "border-bottom",
    "text-center",
  );
  cardInstock.textContent = "Quantity: " + data.quantity;

  // let cardTxt = document.createElement("p");
  // cardTxt.classList.add("card-text", "text-truncate");
  // cardTxt.textContent = data.description;

  let cardBtn = document.createElement("button");
  cardBtn.classList.add("btn", "btn-outline-success", "mt-auto");
  cardBtn.onclick = () => getProductById(data.id);
  cardBtn.textContent = "Buy Now";

  let btnDiv = document.createElement("div");
  btnDiv.classList.add(
    "d-flex",
    "justify-content-between",
    "align-items-center",
    "mt-2",
  );

  let addToCartBtn = document.createElement("button");
  addToCartBtn.classList.add("btn", "btn-outline-warning", "px-4", "py-1");
  addToCartBtn.innerHTML = `<i class="bi bi-cart-plus fs-5"></i>`;
  addToCartBtn.onclick = () => quantityIncrement(data.id);

  let remFromCartBtn = document.createElement("button");
  remFromCartBtn.classList.add("btn", "btn-outline-secondary", "px-4", "py-1");
  remFromCartBtn.innerHTML = `<i class="bi bi-cart-dash fs-5"></i>`;
  remFromCartBtn.onclick = () => quantityDecrement(data.id);

  let clearBtn = document.createElement("button");
  clearBtn.classList.add("btn", "btn-outline-danger", "px-4", "mt-2");
  clearBtn.innerHTML = `<i class="bi bi-trash"></i>`;
  clearBtn.onclick = () => clearCart(data.id);

  btnDiv.append(remFromCartBtn, cardInstock, addToCartBtn);

  cardBody.append(cardTitle, cardPrice, cardBtn, btnDiv, clearBtn);

  childDiv.append(cardImg, cardBody);

  parentCartDiv.append(childDiv);
}

function getItems(data) {
  parentCartDiv.innerHTML =
    '<h3 class="text-white mt-4 mt-md-0">No items...</h3>';
  if (data.products.length > 0) {
    console.log(data.products);
    console.log("true");
    parentCartDiv.textContent = "";
    for (let i = 0; i < data.products.length; i++) {
      let product = data.products[i];
      iterateingProducts(product);
    }
  }
}

function quantityIncrement(id) {
  const cart = JSON.parse(localStorage.getItem(`cart-${user.id}`));
  const product = cart.products.find((p) => p.id === id);
  product.quantity++;
  localStorage.setItem(`cart-${user.id}`, JSON.stringify(cart));
  const updatedCart = JSON.parse(localStorage.getItem(`cart-${user.id}`));
  getItems(updatedCart);
}

function quantityDecrement(id) {
  const cart = JSON.parse(localStorage.getItem(`cart-${user.id}`));
  const product = cart.products.find((cartId) => cartId.id === id);
  if (product.quantity > 1) {
    product.quantity--;
  } else {
    clearCart(id);
  }
  localStorage.setItem(`cart-${user.id}`, JSON.stringify(cart));
  const updatedCart = JSON.parse(localStorage.getItem(`cart-${user.id}`));
  getItems(updatedCart);
}

function clearCart(id) {
  const cart = JSON.parse(localStorage.getItem(`cart-${user.id}`));
  let product = cart.products.findIndex((cartId) => cartId.id === id);
  cart.products.splice(product, 1);
  console.log(cart);
  localStorage.setItem(`cart-${user.id}`, JSON.stringify(cart));
  const updatedCart = JSON.parse(localStorage.getItem(`cart-${user.id}`));
  return getItems(updatedCart);
}

getItems(cart);
