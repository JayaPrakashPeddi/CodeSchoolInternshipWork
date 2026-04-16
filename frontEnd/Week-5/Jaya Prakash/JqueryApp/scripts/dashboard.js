if (checkAuth()) {
  $(document).ready(function () {
    $.ajax({
      type: "GET",
      url: "https://dummyjson.com/recipes",
      success: function (response) {
        getItems(response);
      },
      error: function (err) {
        console.error(err);
        alert("Error while fetching the data...logging off...");
      },
    });
    $("#searchBtn").click(function () {
      let input = $("#searchInput").val();
      searchItems(input);
    });
  });
}

function setEachProduct(data, flag) {
  const mainDiv = $("#parentDiv");

  let parentDiv = $("<div>")
    .addClass(
      "border border-light bg-low-opacity rounded-4 text-light z-1 hover-animation",
    )
    .css({ width: "80%", cursor: "pointer" })
    .attr({
      "data-bs-toggle": "modal",
      "data-bs-target": "#recipeModal",
    });
  parentDiv.on("click", function () {
    openRecipeModal(data);
  });

  let child = $("<div>").addClass("row align-items-center gap-3 px-4 py-3");

  let grandChild1 = $("<div>")
    .addClass("col-lg-3")
    .append(
      $("<img>")
        .addClass("img-fluid rounded-4")
        .attr({ src: data.image, alt: "img" }),
    );

  let grandChild2 = $("<div>").addClass("col-lg-8 p-3");

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
    .append($("<i>").append($("<p>").addClass("text-white").text("show more")));

  // <i
  //               class="bi bi-search"

  //             ></i>

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
    } else {
      flag = false;
      setEachProduct(recipe, flag);
    }
  }
}

function openRecipeModal(data) {
  $("#recipeImg").attr("src", data.image);
  $("#recipeTitle").text(data.name);
  $("#recipeIngredients").text(data.ingredients.join(", "));
  $("#prepTimeMinutes").text(data.prepTimeMinutes + " Mins");
  $("#cookTimeMinutes").text(data.cookTimeMinutes + " Mins");
  $("#cuisine").text(data.cuisine);
  $("#rating").text(data.rating + " ⭐");

  let Instructions = $("#instructions");
  Instructions.empty();

  for (let step of data.instructions) {
    Instructions.append($("<li>").text(step));
  }
}

function searchItems(input) {
  console.log(input);
  if (input) {
    $.ajax({
      type: "GET",
      url: `https://dummyjson.com/recipes/search?q=${input}`,
      success: function (response) {
        console.log(response.recipes);

        $("#parentDiv")
          .empty()
          .append(
            $("<a>")
              .attr("href", "../templates/dashboard.html")
              .addClass(
                "btn btn-primary border-white rounded-circle position-fixed backbutton-position z-2",
              )
              .html("<i class='bi bi-arrow-left'></i>"),
          );
        if (response.recipes.length > 0) {
          getItems(response);
        } else {
          $("#parentDiv").append($("<h4>").text("No Recipes Found..."));
        }
      },
      error: function (err) {
        console.log(err);
      },
    });
  }
}
