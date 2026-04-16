checkAuth();
const productsParentDiv = document.getElementById("mainBody");
const user = JSON.parse(localStorage.getItem("user"));
const users = document.querySelectorAll(".user");
users.forEach((ele) => {
  ele.textContent = user.username;
});

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
      localStorage.setItem("user", JSON.stringify(data));
    })
    .catch((err) => {
      console.error(err);
      alert("Session Expired...logging out...");
    });
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "../templates/index.html";
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

  productsParentDiv.append(childDiv);
}

function getItems(data) {
  for (let i = 0; i < data.products.length - 2; i++) {
    let product = data.products[i];
    iterateingProducts(product);
  }
}

function searchItem() {
  let input = document.getElementById("searchInput").value;
  if (input===""){
    input = document.getElementById("searchInputOffcanvas").value;
  }
  fetch(`https://dummyjson.com/products/search?q=${input}`)
    .then((res) => {
      if (!res.ok) {
        console.log("okay")
        return;
      }
      return res.json();
    })
    .then((data) => {
      productsParentDiv.textContent = "";
      getItems(data);
    });
}
