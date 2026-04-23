// ==========================
// ✅ BASE URL (AUTO SWITCH)
// ==========================
const BASE =
  window.location.hostname === 'localhost'
    ? 'http://localhost:8080'
    : 'https://retailmanagementspringbackend-production.up.railway.app';

console.log("JS LOADED");

// ==========================
// ✅ GET ALL ELEMENTS
// ==========================

// Buttons
const btnGetCustomers = document.getElementById("btnGetCustomers");
const btnUpdateCustomer = document.getElementById("btnUpdateCustomer");
const btnGetOrdersByCustomer = document.getElementById("btnGetOrdersByCustomer");
const btnGetOrdersByRange = document.getElementById("btnGetOrdersByRange");
const btnUpdateStock = document.getElementById("btnUpdateStock");

// Inputs
const searchCustomerType = document.getElementById("searchCustomerType");

const updCustId = document.getElementById("updCustId");
const updCustName = document.getElementById("updCustName");
const updCustEmail = document.getElementById("updCustEmail");
const updCustType = document.getElementById("updCustType");

const orderCustomerId = document.getElementById("orderCustomerId");

const rangeCustomerType = document.getElementById("rangeCustomerType");
const rangeMin = document.getElementById("rangeMin");
const rangeMax = document.getElementById("rangeMax");

const prodId = document.getElementById("prodId");
const prodName = document.getElementById("prodName");
const prodPrice = document.getElementById("prodPrice");
const prodStock = document.getElementById("prodStock");

// Tables
const customerTableBody = document.getElementById("customerTableBody");
const customerTableWrap = document.getElementById("customerTableWrap");

const orderByCustomerTableBody = document.getElementById("orderByCustomerTableBody");
const orderByCustomerTableWrap = document.getElementById("orderByCustomerTableWrap");

const orderByRangeTableBody = document.getElementById("orderByRangeTableBody");
const orderByRangeTableWrap = document.getElementById("orderByRangeTableWrap");

// Server status
const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");

// ==========================
// ✅ SERVER CHECK (FIXED)
// ==========================
async function checkServer() {
  try {
    const res = await fetch(`${BASE}/customer/controller/getCustomersByType/Platinum`);

    if (res.ok) {
      statusDot.className = "status-dot online";
      statusText.textContent = "Server Online";
    } else {
      throw new Error();
    }
  } catch {
    statusDot.className = "status-dot offline";
    statusText.textContent = "Server Offline";
  }
}

checkServer();
setInterval(checkServer, 30000);

// ==========================
// ✅ GET CUSTOMERS
// ==========================
btnGetCustomers.onclick = async () => {
  const type = searchCustomerType.value;

  if (!type) {
    alert("Select customer type");
    return;
  }

  try {
    const res = await fetch(`${BASE}/customer/controller/getCustomersByType/${type}`);
    const data = await res.json();

    customerTableBody.innerHTML = data.map(c => `
      <tr>
        <td>${c.customerId}</td>
        <td>${c.customerName}</td>
        <td>${c.customerEmail}</td>
        <td>${c.customerType}</td>
      </tr>
    `).join("");

    customerTableWrap.style.display = "block";

  } catch {
    alert("Error fetching customers");
  }
};

// ==========================
// ✅ UPDATE CUSTOMER
// ==========================
btnUpdateCustomer.onclick = async () => {
  const payload = {
    customerId: updCustId.value,
    customerName: updCustName.value,
    customerEmail: updCustEmail.value,
    customerType: updCustType.value
  };

  try {
    const res = await fetch(`${BASE}/customer/controller/updateCustomer`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    alert(await res.text());

  } catch {
    alert("Update failed");
  }
};

// ==========================
// ✅ GET ORDERS BY CUSTOMER ID
// ==========================
btnGetOrdersByCustomer.onclick = async () => {
  const id = orderCustomerId.value;

  if (!id) {
    alert("Enter Customer ID");
    return;
  }

  try {
    const res = await fetch(`${BASE}/order/controller/getOrderDetailsByCustomerId/${id}`);
    const data = await res.json();

    orderByCustomerTableBody.innerHTML = data.map(o => `
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

    orderByCustomerTableWrap.style.display = "block";

  } catch {
    alert("Error fetching orders");
  }
};

// ==========================
// ✅ GET ORDERS BY RANGE (FINAL FIX)
// ==========================
btnGetOrdersByRange.onclick = async () => {
  const type = rangeCustomerType.value;
  const min = rangeMin.value;
  const max = rangeMax.value;

  if (!type || !min || !max) {
    alert("Fill all fields");
    return;
  }

  try {
    const url = `${BASE}/order/controller/getOrderDetailsByCustomerTypeAndBillInRange/${type}/${min}/${max}`;
    console.log("Calling:", url);

    const res = await fetch(url);

    if (!res.ok) throw new Error(await res.text());

    const data = await res.json();

    orderByRangeTableBody.innerHTML = data.map(o => `
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

    orderByRangeTableWrap.style.display = "block";

  } catch (err) {
    alert("Range fetch failed: " + err.message);
  }
};

// ==========================
// ✅ UPDATE PRODUCT STOCK
// ==========================
btnUpdateStock.onclick = async () => {
  const payload = {
    productId: prodId.value,
    productName: prodName.value,
    price: prodPrice.value,
    stock: prodStock.value
  };

  try {
    const res = await fetch(`${BASE}/product/controller/updateProductStock`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    alert(await res.text());

  } catch {
    alert("Stock update failed");
  }
};
