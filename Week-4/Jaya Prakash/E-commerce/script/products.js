const parentDiv = document.getElementById("mainBody");

checkAuth();

function checkAuth() {
  const userToken = localStorage.getItem("token");
  if (!userToken) {
    logout();
    return;
  }

  fetch("https://dummyjson.com/auth/me", {
    headers: { Authorization: `Bearer ${userToken}` },
  })
    .then((res) => {
      if (!res.ok) {
        logout();
        return;
      }
      return res.json();
    })
    .then((data) => {
      document.getElementById("user").textContent = data.username;
      localStorage.setItem("user", JSON.stringify(data));
    })
    .catch((err) => {
      console.error(err);
      alert("Error while fetching data....");
    });
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "../templates/index.html";
}

function displayProducts() {
  fetch("https://dummyjson.com/products")
    .then((res) => res.json())
    .then((data) => {
      parentDiv.textContent = "";
      getItems(data);
    })
    .catch(() => alert("Failed while fetching the data..."));
}

displayProducts();

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

function getItems(data) {
  for (let i = 0; i < data.products.length - 2; i++) {
    let product = data.products[i];
    iterateingProducts(product);
  }
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

function getProductById(id) {
  fetch(`https://dummyjson.com/products/${id}`)
    .then((res) => res.json())
    .then((data) => {
      localStorage.setItem("product", JSON.stringify(data));
      window.location.href = "./productDtls.html";
    })
    .catch((err) => console.error(err));
}
