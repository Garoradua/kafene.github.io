// login. js
$(document).ready(() => {
    var loginForm = $(".login-form");
    loginForm.submit((e) => {
      e.preventDefault();
      var userName = $(".username").val();
      var password = $(".password").val();
      if (!userName || !password) {
        alert("Please fill all the credentials");
      } else if (userName !== password) {
        alert("Invalid credentails");
      } else if (userName === password) {
        localStorage.setItem("status", true);
        alert("Login Successful");
        window.location.href = "/order.html";
      } else {
        alert("Something went wrong");
      }
    });
  });
  
// main.js
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
  

  // order.js
  $(document).ready(() => {
    var tableBody = $(".table-body");
    var orderData = [];
    function shuffleData(data) {
      return data.sort(() => Math.random() - 0.5);
    }
  
    function renderOrderCount(data) {
      $(".filter-options p").text(`Count: ${data.length}`);
    }
    $.get("https://5fc1a1c9cb4d020016fe6b07.mockapi.io/api/v1/orders", (res) => {
      if (res && res.length > 0) {
        orderData = res;
        shuffleData(res).forEach((data) => generateRows(data));
        renderOrderCount(res);
      }
    });
  
    function generateRows(data) {
      var day = data.orderDate.split("-")[0];
      var month = data.orderDate.split("-")[1];
      var year = data.orderDate.split("-")[2];
      var tableRow = $("<tr>").addClass("table-row");
      var dataId = $("<td>").addClass("table-text-gray");
      var dataCustomerName = $("<td>").addClass("table-text-primary");
      var dataTime = $("<td>").addClass("table-text-primary");
      var dataPrice = $("<td>").addClass("table-text-gray");
      var dataStatus = $("<td>").addClass("table-text-primary");
      tableRow.append(dataId.text(data.id));
      tableRow.append(dataCustomerName.text(data.customerName));
      tableRow.append(
        dataTime.html(
          `${day} ${month}, ${year} <br /><span className='table-text-gray'>${data.orderTime}</span>`
        )
      );
      tableRow.append(dataPrice.text(`$ ${data.amount}`));
      tableRow.append(dataStatus.text(data.orderStatus));
      tableBody.append(tableRow);
    }
  
    var checkboxes = $(".filter-checkboxes input");
    checkboxes.change(onFilterClick);
  
    function onFilterClick() {
      window.scrollTo(0, 0);
      var newOrders = orderData.filter(
        ({ orderStatus }) => orderStatus === "New"
      );
      var packedOrders = orderData.filter(
        ({ orderStatus }) => orderStatus === "Packed"
      );
      var transitOrders = orderData.filter(
        ({ orderStatus }) => orderStatus === "InTransit"
      );
      var deliveredOrders = orderData.filter(
        ({ orderStatus }) => orderStatus === "Delivered"
      );
  
      var isNewChecked = $(".new")[0].checked;
      var ispackedChecked = $(".packed")[0].checked;
      var isTransitChecked = $(".transit")[0].checked;
      var isDeliveredChecked = $(".delivered")[0].checked;
      var returningOrders = [];
      if (isNewChecked) {
        returningOrders = [...returningOrders, ...newOrders];
      }
      if (ispackedChecked) {
        returningOrders = [...returningOrders, ...packedOrders];
      }
      if (isTransitChecked) {
        returningOrders = [...returningOrders, ...transitOrders];
      }
      if (isDeliveredChecked) {
        returningOrders = [...returningOrders, ...deliveredOrders];
      }
  
      tableBody.html("");
      shuffleData(returningOrders).forEach((order) => generateRows(order));
      renderOrderCount(returningOrders);
    }
  });

  
  //product.js
  $(document).ready(() => {
    var tableBody = $(".table-body");
    var productsData = [];
    function shuffleData(data) {
      return data.sort(() => Math.random() - 0.5);
    }
  
    function renderProductCount(data) {
      $(".filter-options p").text(`Count: ${data.length}`);
    }
  
    $.get(
      "https://5fc1a1c9cb4d020016fe6b07.mockapi.io/api/v1/products",
      (res) => {
        if (res && res.length > 0) {
          productsData = res.map((product) => ({
            ...product,
            isExpired: new Date(product.expiryDate) < new Date(),
            isLowStock: product.stock < 100,
          }));
          shuffleData(productsData).forEach((data) => generateRows(data));
          renderProductCount(res);
        }
      }
    );
  
    function generateRows(data) {
      var day = data.expiryDate.split("-")[0];
      var month = data.expiryDate.split("-")[1];
      var year = data.expiryDate.split("-")[2];
  
      var tableRow = $("<tr>").addClass("table-row");
      var dataId = $("<td>").addClass("table-text-gray");
      var productName = $("<td>").addClass("table-text-primary");
      var productBrand = $("<td>").addClass("table-text-gray");
      var dataTime = $("<td>").addClass("table-text-primary");
      var dataPrice = $("<td>").addClass("table-text-gray");
      var dataStock = $("<td>").addClass("table-text-gray");
      tableRow.append(dataId.text(data.id));
      tableRow.append(productName.text(data.medicineName));
      tableRow.append(productBrand.text(data.medicineBrand));
      tableRow.append(dataTime.text(`${day} ${month}, ${year}`));
      tableRow.append(dataPrice.text(`$ ${data.unitPrice}`));
      tableRow.append(dataStock.text(data.stock));
      tableBody.append(tableRow);
    }
  
    var checkboxes = $(".filter-checkboxes input");
    checkboxes.change(onFilterClick);
  
    function onFilterClick() {
      window.scrollTo(0, 0);
      var isExpiredCheck = $(".expired")[0].checked;
      var isLowStockCheck = $(".low-stock")[0].checked;
      var expiredProducts = productsData.filter(({ isExpired }) => isExpired);
  
      var lowStockProducts = productsData.filter(({ isLowStock }) => isLowStock);
  
      var returnedProduct = [];
      if (isExpiredCheck) {
        returnedProduct = [...expiredProducts];
      }
      if (isLowStockCheck) {
        returnedProduct = [...lowStockProducts];
      }
      if (isExpiredCheck && isLowStockCheck) {
        returnedProduct = productsData;
      }
      tableBody.html("");
      shuffleData(returnedProduct).forEach((order) => generateRows(order));
      renderProductCount(returnedProduct);
    }
  });
  

  //user.js
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
  