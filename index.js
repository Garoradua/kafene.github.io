$(document).ready(() => {
  var isLoggedIn = localStorage.getItem("status")
    ? JSON.parse(localStorage.getItem("status"))
    : null;
  var { pathname } = window.location;
  if (isLoggedIn && (pathname === "/index.html" || pathname === "/")) {
    window.history.back();
  } else if (!isLoggedIn && pathname !== "/index.html") {
    window.location.href = "/index.html";
  }
  var logoutButton = $(".logout-button");
  logoutButton.click(() => {
    localStorage.clear();
    window.location.href = "/index.html";
  });
});
