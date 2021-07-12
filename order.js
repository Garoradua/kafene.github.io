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
