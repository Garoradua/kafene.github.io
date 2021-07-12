$(document).ready(() => {
  var usersData = [];

  function shuffleData(data) {
    return data.sort((a, b) => a.id - b.id);
  }

  var tableBody = $(".table-body");

  function fetchUsers() {
    tableBody.html("");
    $.get("https://5fc1a1c9cb4d020016fe6b07.mockapi.io/api/v1/users", (res) => {
      if (res && res.length > 0) {
        usersData = res;
        shuffleData(res).forEach((data) => generateRows(data));
      }
    });
  }
  fetchUsers();

  function generateRows(data) {
    const day = data.dob.split("-")[0];
    const month = data.dob.split("-")[1];
    const year = data.dob.split("-")[2];

    var tableRow = $("<tr>").addClass("table-row");
    var dataId = $("<td>").addClass("table-text-gray");
    var profilePic = $("<td>").addClass("table-text-primary");
    var profilePicImage = $("<img>")
      .attr("src", data.profilePic)
      .attr("alt", "profilePic");

    var userName = $("<td>").addClass("table-text-sec");
    var userDob = $("<td>").addClass("table-text-primary");
    var userGender = $("<td>").addClass("table-text-gray");
    var userLocation = $("<td>").addClass("table-text-gray");

    tableRow.append(dataId.text(data.id));
    tableRow.append(profilePic.html(profilePicImage));
    tableRow.append(userName.text(data.fullName));
    tableRow.append(userDob.text(`${day} ${month}, ${year}`));
    tableRow.append(userGender.text(data.gender));

    tableRow.append(
      userLocation.text(`${data.currentCity}, ${data.currentCountry}`)
    );
    tableBody.append(tableRow);
  }

  var filterForm = $(".user-filter-wrapper");
  filterForm.submit((e) => {
    e.preventDefault();
    var searchQuery = $(".user-search").val();
    if (searchQuery.length < 2) {
      alert("Please enter atleast 2 characters");
    } else {
      tableBody.html("");
      $.get(
        `https://5fc1a1c9cb4d020016fe6b07.mockapi.io/api/v1/users?fullName=${searchQuery}`,
        (res) => {
          if (res && res.length > 0) {
            usersData = res;
            shuffleData(res).forEach((data) => generateRows(data));
          }
        }
      );
    }
  });

  var resetButton = $(".reset-search");
  resetButton.click(fetchUsers);
});
