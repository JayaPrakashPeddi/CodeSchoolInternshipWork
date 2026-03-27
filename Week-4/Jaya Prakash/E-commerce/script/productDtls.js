const productStr = localStorage.getItem("product");
const product = JSON.parse(productStr);
const parentDiv = document.getElementById("productDtlsBody");

getProductFromLS();
function getProductFromLS() {
  if (!product) {
    window.location.href = "./products.html";
    return;
  }

  let cardImg = document.getElementById("productImg");
  cardImg.src = product.thumbnail;

  let cardTitle = document.getElementById("productTitle");
  cardTitle.textContent = product.title;

  let cardText = document.getElementById("productText");
  cardText.textContent = product.description;

  let cardPrice = document.getElementById("price");
  let priceInRupee = Math.round(product.price * 93.81);
  cardPrice.textContent = "₹. " + priceInRupee;

  let cardStock = document.getElementById("stock");
  cardStock.textContent = `In-Stock : ${product.stock}`;

  let cardRating = document.getElementById("rating");
  cardRating.textContent = `Rating : ${product.rating}`;

  const reviewCard = document.getElementById("reviewsDiv");
  const addToCartBtn = document.getElementById("addtoCartBtn");
  addToCartBtn.onclick = () =>
    addToCart(product.id, product.thumbnail, product.title, product.price);

  for (let i = 0; i < product.reviews.length; i++) {
    let reviewParent = document.createElement("div");
    reviewParent.classList.add(
      "text-white",
      "border",
      "rounded-4",
      "px-4",
      "pt-3",
      "pb-0",
    );
    reviewParent.style.width = "23rem";

    const userDiv = document.createElement("div");
    userDiv.classList.add("w-100", "d-flex", "border-bottom");

    const user = document.createElement("h6");
    user.textContent = product.reviews[i].reviewerName;

    const userRating = document.createElement("span");
    userRating.classList.add("ms-auto");
    userRating.innerHTML = `<i class="bi bi-star-fill" style="color:yellow;"></i> ${product.reviews[i].rating}`;

    userDiv.append(user, userRating);

    const reviewText = document.createElement("p");
    reviewText.innerHTML = `<i class="text-muter">Says:</i> ${product.reviews[i].comment}`;

    reviewParent.append(userDiv, reviewText);
    reviewCard.append(reviewParent);
  }
}

function iterateingProducts(data) {
  let childDiv = document.createElement("div");
  childDiv.classList.add("card", "bg-low-opacity", "text-white", "border");
  childDiv.style.width = "18rem";

  let cardImg = document.createElement("img");
  cardImg.src = data.thumbnail;
  cardImg.classList.add("card-img-top");
  cardImg.alt = "product-img";
  cardImg.height = "250";

  let cardBody = document.createElement("div");
  cardBody.classList.add("card-body", "d-flex", "flex-column");

  let cardTitle = document.createElement("h5");
  cardTitle.classList.add("card-title");
  cardTitle.textContent = data.title;

  let cardPrice = document.createElement("span");
  cardPrice.classList.add("fs-6", "me-4", "text-success");
  let priceInRupee = Math.round(data.price * 93.81);
  cardPrice.textContent = "₹. " + priceInRupee;

  let cardTxt = document.createElement("p");
  cardTxt.classList.add("card-text", "text-truncate");
  cardTxt.textContent = data.description;

  let cardBtn = document.createElement("button");
  cardBtn.classList.add("btn", "btn-outline-success", "mt-auto");
  cardBtn.onclick = () => getProductById(data.id);
  cardBtn.textContent = "Buy Now";

  cardBody.append(cardTitle, cardPrice, cardTxt, cardBtn);

  childDiv.append(cardImg, cardBody);

  parentDiv.append(childDiv);
}

function searchItem() {
  const input = document.getElementById("searchInput").value;
  fetch(`https://dummyjson.com/products/search?q=${input}`)
    .then((res) => {
      if (!res.ok) {
        return;
      }
      return res.json();
    })
    .then((data) => {
      parentDiv.textContent = "";
      getItems(data);
    });
}

function getItems(data) {
  for (let i = 0; i < data.products.length - 2; i++) {
    let product = data.products[i];
    iterateingProducts(product);
  }
}

function getCart() {
  const cart = JSON.parse(localStorage.getItem(`cart-${user.id}`));
  if (cart) {
    return cart;
  }
  return { products: [] };
}

function addToCart(productId, img, title, price, quantity = 1) {
  let cart = getCart();
  const product = cart.products.find((p) => p.id === productId);
  if (product) {
    product.quantity += quantity;
  } else {
    cart.products.push({ id: productId, img, title, price, quantity });
  }
  localStorage.setItem(`cart-${user.id}`, JSON.stringify(cart));
  alert("Cart item added!...");
}
