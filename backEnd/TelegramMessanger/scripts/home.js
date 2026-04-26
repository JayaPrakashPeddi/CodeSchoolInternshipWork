const userToken = localStorage.getItem("userToken");
const userNameRegex = /^[a-zA-Z][a-zA-Z0-9._]{2,19}$/;

if (!userToken) {
  logout();
}

function logout() {
  const token = localStorage.getItem("userToken");

  $.ajax({
    type: "post",
    url: "../api/logout.php",
    data: { userToken: token },
    dataType: "json",
    complete: function () {
      localStorage.removeItem("userToken");
      window.location.href = "./index.html";
    },
  });
}

function validateToken() {
  $.ajax({
    type: "post",
    url: "../api/validateToken.php",
    data: { userToken },
    dataType: "json",

    success: function (response) {
      if (!response || !response.status) {
        logout();
      } else {
        const photo = response.data.photo || "default.png";
        $("#userProfile").attr("src", `./uploads/${photo}`);
        $("#userName").text(response.data.username);
      }
    },

    error: function () {
      logout();
    },
  });
}

function fetchMessages(username) {
  const chatArea = $("#chatArea");
  $.ajax({
    type: "post",
    url: "../api/fetchMessages.php",
    data: { username, userToken },
    dataType: "json",
    success: function (response) {
      if (response.status) {
        console.log(response);
        for (let i = 0; i < response.data.length; i++) {
          let is_mine = response.data[i].is_mine;
          let datetime = response.data[i].send_at;
          let time = datetime.slice(11, 16);
          if (!is_mine) {
            chatArea.append(
              $("<div>")
                .addClass("d-flex")
                .append(
                  $("<div>")
                    .addClass("msg received")
                    .text(response.data[i].message_content)
                    .append($("<span>").addClass("msg-time").text(time)),
                ),
            );
            continue;
          }
          chatArea.append(
            $("<div>")
              .addClass("d-flex justify-content-end")
              .append(
                $("<div>")
                  .addClass("msg sent")
                  .text(response.data[i].message_content)
                  .append($("<span>").addClass("msg-time").text(time)),
              ),
          );
        }
      }
    },
  });
}

function getChatContent(username,id) {
  $(".active-contact").removeClass("active-contact");
  $(`#${id}`).addClass("active-contact");
  $("#chatBox").load("./templates/chatBox.html", function () {
    const pfp = $("#contactProfilePicture");
    const contactUsername = $("#contactUsername");
    const contactStatus = $("#contactStatus");
    const sendBtn = $("#sendBtn");
    contactUsername.text("");
    contactStatus.text("");
    $.ajax({
      type: "post",
      url: "../api/getChatContent.php",
      data: { username, userToken },
      dataType: "json",
      success: function (response) {
        if (response.status) {
          pfp.attr("src", `./uploads/${response.data.photo}`);
          contactUsername.text(response.data.username);
          if (response.data.is_online) {
            contactStatus.text("online").addClass("text-success");
          } else {
            contactStatus.text("offline").addClass("text-secondary");
          }
          sendBtn.attr("onclick", `sendMessage('${response.data.username}')`);
          $("#charArea").text("");
          fetchMessages(username);
        }
      },
    });
  });
}

function getContacts() {
  $.ajax({
    type: "post",
    url: "../api/getUserContacts.php",
    data: { userToken },
    dataType: "json",
    success: function (response) {
      if (response.status) {
        const contactsContainer = $("#contactsContainer");
        for (let i = 0; i < response.data.length; i++) {
          let is_online;
          if (response.data[i].is_online) {
            is_online = $("<small>").addClass("text-success").text("online");
          } else {
            is_online = $("<small>").addClass("text-secondary").text("offline");
          }

          contactsContainer.append(
            $("<div>")
              .addClass(
                "d-flex align-items-center bg-white gap-2 p-2 contact onHover m-1 rounded-2",
              )
              .attr({
                id:`contact${i}`,
                onclick: `getChatContent('${response.data[i].username}','contact${i}')`,
              })
              .append(
                $("<img>")
                  .addClass("rounded-circle")
                  .attr({
                    src: `./uploads/${response.data[i].photo}`,
                    height: "50",
                    width: "50",
                  }),
                $("<div>")
                  .addClass("flex-grow-1")
                  .append(
                    $("<div>")
                      .addClass("fw-semibold")
                      .text(response.data[i].username),
                    $("<small>")
                      .addClass("text-muted text-truncate d-block")
                      .text(response.data[i].bio),
                  ),
                is_online,
              ),
          );
        }
      }
    },
  });
}

// <div
//   class="d-flex align-items-center bg-white gap-2 p-2 contact rounded-2 m-1 onHover"
// >
//   <img
//     src="./assects/placeholderImg.jpg"
//     height="50"
//     width="50"
//     class="rounded-circle"
//   />
//   <div class="flex-grow-1">
//     <div class="fw-semibold">Alice</div>
//     <small class="text-muted text-truncate d-block"
//       >Typing...</small
//     >
//   </div>
//   <small class="text-muted">11:10</small>
// </div>

function sendFriendRequest(username, i) {
  $(`#friendRequestBtn${i}`).addClass("d-none");
  $(`#spinnerIcon${i}`).removeClass("d-none");
  $.ajax({
    type: "post",
    url: "../api/friendRequests.php",
    data: { username, userToken },
    dataType: "token",
    success: function (response) {
      $(`#friendRequestBtnContainer${i}`).attr({ onclick: "" });
      $(`#spinnerIcon${i}`).addClass("d-none");
      $(`#personCheck${i}`).removeClass("d-none");
    },
    error: function () {
      $(`#friendRequestBtnContainer${i}`).attr({ onclick: "" });
      $(`#spinnerIcon${i}`).addClass("d-none");
      $(`#personCheck${i}`).removeClass("d-none");
    },
  });
}

function acceptRequest(username, i) {
  $.ajax({
    type: "post",
    url: "../api/acceptRequest.php",
    data: { username, userToken },
    dataType: "json",
    success: function (response) {
      if (response.status) {
        $(`#actionBtnsDiv${i}`).addClass("d-none");
        $(`#accepted${i}`).removeClass("d-none");
        // ajax call for contacts;
      }
    },
  });
}

function rejectRequest(username) {
  $.ajax({
    type: "post",
    url: "../api/rejectRequest.php",
    data: { username, userToken },
    dataType: "json",
    success: function (response) {
      if (response.status) {
        $(`#actionBtnsDiv${i}`).addClass("d-none");
        $(`#rejected${i}`).removeClass("d-none");
        // ajax call for contacts;
      }
    },
  });
}

function getNotifications() {
  $.ajax({
    type: "post",
    url: "../api/getNotifications.php",
    data: { userToken },
    dataType: "json",
    success: function (response) {
      if (response.status) {
        const notificationPanal = $("#notificationPanal");
        notificationPanal.text("");
        if (response.data.length > 0) {
          $("#notificationsPopupIcon").removeClass("d-none");
        }
        for (let i = 0; i < response.data.length; i++) {
          notificationPanal.append(
            $("<div>")
              .addClass(
                "d-flex align-items-center gap-2 p-2 contact rounded-2 m-1",
              )
              .css({ "background-color": "lightgray" })
              .append(
                $("<img>")
                  .addClass("rounded-circle")
                  .attr({
                    src: `./uploads/${response.data[i].photo}`,
                    height: "50",
                    width: "50",
                  }),
                $("<div>")
                  .addClass("flex-grow-1")
                  .append(
                    $("<div>")
                      .addClass("fw-semibold fs-5")
                      .text(response.data[i].username),
                    $("<small>").text("Has send you chat request!!"),
                  ),
                $("<div>")
                  .addClass("d-flex gap-1")
                  .attr({ id: `actionBtnsDiv${i}` })
                  .append(
                    $("<button>")
                      .addClass("btn btn-outline-success fs-5 fw-semibold p-1")
                      .attr(
                        "onclick",
                        `acceptRequest('${response.data[i].username}',${i})`,
                      )
                      .html(`<i class="bi bi-check-lg"></i>`),
                    $("<button>")
                      .addClass("btn btn-outline-danger fs-5 fw-semibold p-1")
                      .attr(
                        "onclick",
                        `rejectRequest('${response.data[i].username}',${i})`,
                      )
                      .html(`<i class="bi bi-x-lg"></i>`),
                  ),
                $("<i>")
                  .addClass("bi bi-person-check fs-5 text-success d-none")
                  .attr("id", `accepted${i}`),
                $("<i>")
                  .addClass("bi bi-person-x fs-5 text-danger d-none")
                  .attr("id", `rejected${i}`),
              ),
          );
        }
      }
    },
  });
}

function sendMessage(username) {
  const textmsg = $("#messageInput").val();
  if (!textmsg) {
    console.log(textmsg + "-fail");
    return;
  }
  console.log(textmsg);
  $.ajax({
    type: "post",
    url: "../api/sendMessage.php",
    data: { userToken, username, textmsg },
    dataType: "json",
    success: function (response) {
      if (response.status) {
        $("#messageInput").val("");
        $("#chatArea").text("");
        fetchMessages(username);
      }
    },
  });
}
// <div
//           class=""
//           style=": ;"
//         >
//           <i class="bi bi-person-check fs-5 text-success d-none" id="accepted"></i>
//           <i class="bi bi-person-x fs-5 text-danger d-none" id="rejected"></i>
//         </div>

$(document).ready(function () {
  validateToken();
  getContacts();
  getNotifications();

  $(document).on("click", "#logoutBtn", function () {
    logout();
  });

  let searchContactTimer;
  $(document).on("input", "#searchContacts", function () {
    $("#cancelSearch").removeClass("d-none");
    clearTimeout(searchContactTimer);
    searchContactTimer = setTimeout(() => {
      const searchInput = $("#searchContacts").val();
      if (!userNameRegex.test(searchInput)) {
        return;
      }
      $.ajax({
        type: "post",
        url: "../api/searchContactByUsername.php",
        data: { searchInput, userToken },
        dataType: "json",
        success: function (response) {
          const contactsContainer = $("#contactsContainer");
          contactsContainer.text("");
          if (response.status) {
            for (let i = 0; i < response.data.length; i++) {
              let contactDiv = $("<div>")
                .addClass(
                  "d-flex align-items-center bg-white gap-2 p-2 contact onHover m-1 rounded-2",
                )
                .append(
                  $("<img>")
                    .addClass("rounded-circle")
                    .attr({
                      src: `./uploads/${response.data[i].photo}`,
                      height: "50",
                      width: "50",
                    }),
                  $("<div>")
                    .addClass("flex-grow-1")
                    .append(
                      $("<div>")
                        .addClass("fw-semibold")
                        .text(response.data[i].username),
                      $("<small>")
                        .addClass("text-muted text-truncate d-block")
                        .text(response.data[i].bio),
                    ),
                );
              if (!response.data[i].is_friend) {
                contactDiv.append(
                  $("<div>")
                    .addClass("text-muted onHover p-2 py-1 rounded-3")
                    .attr({
                      onclick: `sendFriendRequest('${response.data[i].username}', ${i})`,
                      id: `friendRequestBtnContainer${i}`,
                    })
                    .html(
                      `<i class="bi bi-person-plus fs-5" id="friendRequestBtn${i}"></i><i class="bi bi-person-check fs-5 text-success d-none" id="personCheck${i}"></i><i class="spinner-border spinner-border-sm bg-secondary d-none" id="spinnerIcon${i}"></i>`,
                    ),
                );
              }
              contactsContainer.append(contactDiv);
            }
          } else {
            contactsContainer.html("<h5 >No user found!!</h5>");
          }
        },
      });
    }, 1000);
  });

  $(document).on("click", "#cancelSearch", function () {
    $("#contactsContainer").text("");
    $("#searchContacts").val("");
    getContacts();
    $("#cancelSearch").addClass("d-none");
  });
});
