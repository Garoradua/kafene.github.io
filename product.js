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
