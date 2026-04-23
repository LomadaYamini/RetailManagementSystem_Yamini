// ✅ BACKEND URL (CHANGE ONLY IF YOUR URL IS DIFFERENT)
const BASE = "https://retailmanagementspringbackend-production.up.railway.app";

// =====================================================
// SIMPLE TOAST
// =====================================================
function showToast(msg) {
  alert(msg); // keep simple for now
}

// =====================================================
// NAVIGATION (FIX FOR YOUR MAIN ISSUE)
// =====================================================
document.querySelectorAll(".nav-item").forEach(item => {
  item.addEventListener("click", function (e) {
    e.preventDefault();

    // hide all sections
    document.querySelectorAll(".section").forEach(sec => {
      sec.classList.add("hidden");
    });

    // remove active
    document.querySelectorAll(".nav-item").forEach(n => {
      n.classList.remove("active");
    });

    // show selected
    const section = this.dataset.section;
    document.getElementById("section-" + section).classList.remove("hidden");

    this.classList.add("active");
  });
});

// =====================================================
// SERVER CHECK (SIMPLE)
// =====================================================
async function checkServer() {
  try {
    await fetch(BASE);
    document.getElementById("statusText").innerText = "Server Online";
  } catch {
    document.getElementById("statusText").innerText = "Server Offline";
  }
}
checkServer();

// =====================================================
// CUSTOMERS
// =====================================================
document.getElementById("btnGetCustomers").onclick = async () => {
  const type = document.getElementById("searchCustomerType").value;

  if (!type) return showToast("Select type");

  const res = await fetch(`${BASE}/customer/controller/getCustomersByType/${type}`);
  const data = await res.json();

  const tbody = document.getElementById("customerTableBody");

  tbody.innerHTML = data.map(c => `
    <tr>
      <td>${c.customerId}</td>
      <td>${c.customerName}</td>
      <td>${c.customerEmail}</td>
      <td>${c.customerType}</td>
    </tr>
  `).join("");

  document.getElementById("customerTableWrap").style.display = "block";
};

// =====================================================
// ORDERS BY CUSTOMER ID
// =====================================================
document.getElementById("btnGetOrdersByCustomer").onclick = async () => {
  const id = document.getElementById("orderCustomerId").value;

  if (!id) return showToast("Enter Customer ID");

  const res = await fetch(`${BASE}/order/controller/getOrderDetailsByCustomerId/${id}`);
  const data = await res.json();

  const tbody = document.getElementById("orderByCustomerTableBody");

  tbody.innerHTML = data.map(o => `
    <tr>
      <td>${o.orderId}</td>
      <td>${o.customerId}</td>
      <td>${o.customerEmail}</td>
      <td>${o.productName}</td>
      <td>${o.quantity}</td>
      <td>${o.orderDate}</td>
      <td>${o.billingAmount}</td>
    </tr>
  `).join("");

  document.getElementById("orderByCustomerTableWrap").style.display = "block";
};

// =====================================================
// ORDERS BY RANGE
// =====================================================
document.getElementById("btnGetOrdersByRange").onclick = async () => {
  const type = document.getElementById("rangeCustomerType").value;
  const min = document.getElementById("rangeMin").value;
  const max = document.getElementById("rangeMax").value;

  if (!type || !min || !max) return showToast("Fill all fields");

  const res = await fetch(`${BASE}/order/controller/getOrderDetailsByCustomerTypeAndBillInRange/${type}--${min}--${max}`);
  const data = await res.json();

  const tbody = document.getElementById("orderByRangeTableBody");

  tbody.innerHTML = data.map(o => `
    <tr>
      <td>${o.orderId}</td>
      <td>${o.customerId}</td>
      <td>${o.customerEmail}</td>
      <td>${o.productName}</td>
      <td>${o.quantity}</td>
      <td>${o.orderDate}</td>
      <td>${o.billingAmount}</td>
    </tr>
  `).join("");

  document.getElementById("orderByRangeTableWrap").style.display = "block";
};

// =====================================================
// PRODUCT UPDATE
// =====================================================
document.getElementById("btnUpdateStock").onclick = async () => {
  const id = document.getElementById("prodId").value;
  const name = document.getElementById("prodName").value;
  const price = document.getElementById("prodPrice").value;
  const stock = document.getElementById("prodStock").value;

  if (!id || !name || !price || !stock)
    return showToast("Fill all fields");

  const res = await fetch(`${BASE}/product/controller/updateProductStock`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      productId: id,
      productName: name,
      price: price,
      stock: stock
    })
  });

  const text = await res.text();

  document.getElementById("updateStockResponse").innerText = text;
  document.getElementById("updateStockResponse").style.display = "block";
};
