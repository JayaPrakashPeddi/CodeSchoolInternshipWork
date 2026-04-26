const userToken = localStorage.getItem("userToken");

if(!userToken){
  window.location.href="./index.html";
}

function logout(userToken){
  $.ajax({
    type: "post",
    url: "../api/logout.php",
    data: { userToken },
    dataType: "json",
    success: function (response) {
      localStorage.removeItem("userToken");
      window.location.href="./index.html";
    }
  });
}
function validateToken(userToken){
  $.ajax({
    type: "post",
    url: "../api/validateToken.php",
    data: { userToken },
    dataType: "json",
    success: function (response) {
      if (!response.status){
        logout(userToken);
      }
      else{
        $("#userProfile").attr({"src":`./uploads/${response.data.photo}`});
        $("#userName").text(response.data.username)
      }
    }
  });
}


$(document).ready(function () {
    validateToken(userToken);
    $(document).on("click","#logoutBtn",function(){
      logout(userToken);
    })
});