const userToken = localStorage.getItem("userToken");
console.log(userToken);
if(!userToken){
    window.location.href="./login.html";
}
$(document).ready(function () {
    $.ajax({
        type: "post",
        url: "../php/utils/validateToken.php",
        data: { userToken },
        dataType: "json",
        success: function (response) {
            console.log("hi");
            console.log(response);
        },
        error: function(error){
            console.log("error");
            console.error(error);
        }
    });
});