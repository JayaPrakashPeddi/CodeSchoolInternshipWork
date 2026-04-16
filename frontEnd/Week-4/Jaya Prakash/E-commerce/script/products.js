


function displayProducts(page=0,pageId="page-1") {
  const limit = 30;
  const pages = document.querySelectorAll(".pages");
  console.log(pages);
  pages.forEach((ele)=>{
      console.log(ele.id,pageId);
      const pageNode = document.getElementById(ele.id);
    if (ele.id!==pageId){
      pageNode.classList.remove("active");
    }
    else{
      pageNode.classList.add("active");
    }
  })
  fetch(`https://dummyjson.com/products?limit=${limit}&skip=${limit*page}`)
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
