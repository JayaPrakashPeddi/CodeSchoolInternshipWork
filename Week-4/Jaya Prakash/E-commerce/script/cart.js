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
  cardPrice.classList.add("fs-6", "me-4", "text-success");
  let priceInRupee = Math.round(data.price * 93.81);
  cardPrice.textContent = "₹. " + priceInRupee;

  let cardInstock = document.createElement("span");
  cardInstock.classList.add("fs-6", "me-4", "text-white");
  cardInstock.textContent = "Quantity : " + data.quantity;

  let cardTxt = document.createElement("p");
  cardTxt.classList.add("card-text", "text-truncate");
  cardTxt.textContent = data.description;

  let cardBtn = document.createElement("button");
  cardBtn.classList.add("btn", "btn-outline-success", "mt-auto");
  cardBtn.onclick = () => getProductById(data.id);
  cardBtn.textContent = "Buy Now";

  let btnDiv = document.createElement("div");
  btnDiv.classList.add("d-flex","justify-content-evenly","mt-3");

  let addToCartBtn = document.createElement("button");
  addToCartBtn.classList.add("btn","btn-outline-warning","px-5");
  addToCartBtn.innerHTML=`<i class="bi bi-cart-plus fs-5"></i>`;

  let clearBtn = document.createElement("button");
  clearBtn.classList.add("btn","btn-outline-danger","px-5");
  clearBtn.innerHTML=`<i class="bi bi-cart-plus fs-5"></i>`;

  btnDiv.append(addToCartBtn,clearBtn);

  cardBody.append(cardTitle, cardPrice,cardInstock, cardTxt, cardBtn,btnDiv);

  childDiv.append(cardImg, cardBody);

  parentCartDiv.append(childDiv);
}



function getItems(data) {
  console.log(data.products.length)
  for (let i = 0; i < data.products.length; i++) {
    let product = data.products[i];
    iterateingProducts(product);
  }
}

getItems(cart);