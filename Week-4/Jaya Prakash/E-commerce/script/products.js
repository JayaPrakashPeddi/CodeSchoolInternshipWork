function displayProducts() {
  fetch("https://dummyjson.com/products")
    .then((res) => res.json())
    .then((data) => {
      productsParentDiv.textContent = "";
      getItems(data);
    })
    .catch(() => alert("Failed while fetching the data..."));
}

if (productsParentDiv){
displayProducts();
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
