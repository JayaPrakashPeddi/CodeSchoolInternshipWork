if (checkAuth()) {
  $(document).ready(function () {
    $.ajax({
      type: "GET",
      url: "https://dummyjson.com/recipes",
      success: function (response) {
        getItems(response);
      },
    });
  });
}

function setEachProduct(data, flag) {
  const mainDiv = $("#parentDiv");

  let parentDiv = $("<div>")
    .addClass("border border-light bg-low-opacity rounded-4 text-light")
    .css("width", "80rem");

  let child = $("<div>").addClass("row gap-3 px-4 py-3");

  let grandChild1 = $("<div>")
    .addClass("col-3")
    .append(
      $("<img>")
        .addClass("img-fluid rounded-4")
        .attr({ src: data.image, alt: "img" }),
    );

  let grandChild2 = $("<div>").addClass("col-8 p-3");

  let title = $("<h3>").text(data.name);
  let body = $("<p>").append(
    $("<span>").text("Ingredients: ").css("color", "red"),
    data.ingredients.join(", "),
  );
  let level = $("<p>").append(
    $("<span>").text("Difficulty: ").css("color", "red"),
    data.difficulty,
  );
  let time = $("<p>").append(
    $("<span>").text("Cooking Time: ").css("color", "red"),
    data.cookTimeMinutes + " Mins",
  );
  let rate = $("<p>").append(
    $("<span>").text("Rating: ").css("color", "red"),
    data.rating + " ⭐",
  );
  let moreBtn = $("<p>")
    .addClass("w-100 text-center")
    .append(
      $("<i>").append(
        $("<a>").addClass("text-white").attr("href", "#").text("show more"),
      ),
    );

  grandChild2.append(title, body, level, time, rate, moreBtn);

  if (flag) {
    return mainDiv.append(
      parentDiv.append(child.append(grandChild1, grandChild2)),
    );
  }
    grandChild1.addClass("ms-auto");
  return mainDiv.append(
    parentDiv.append(child.append(grandChild2, grandChild1)),
  );
}

function getItems(data) {
  let flag = true;
  for (let i = 0; i < data.recipes.length; i++) {
    let recipe = data.recipes[i];
    if (i % 2 === 0) {
      flag = true;
      setEachProduct(recipe, flag);
    }
    else{
    flag = false;
    setEachProduct(recipe, flag);
    }
  }
}
