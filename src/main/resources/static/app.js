// ✅ BACKEND URL
const BASE = "https://retailmanagementspringbackend-production.up.railway.app";

// =====================================================
// SIMPLE TOAST
// =====================================================
function showToast(msg) {
  alert(msg);
}

// =====================================================
// NAVIGATION (FIXED)
// =====================================================
document.querySelectorAll(".nav-item").forEach(item => {
  item.addEventListener("click", function (e) {
    e.preventDefault();

    document.querySelectorAll(".section").forEach(sec => {
      sec.classList.add("hidden");
    });

    document.querySelectorAll(".nav-item").forEach(n => {
      n.classList.remove("active");
    });

    const section = this.dataset.section;
    document.getElementById("section-" + section).classList.remove("hidden");

    this.classList.add("active");
  });
});

// =====================================================
// SERVER STATUS
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
// CUSTOMERS - GET
// =====================================================
document.getElementById("btnGetCustomers").onclick = async () => {
  const type = document.getElementById("searchCustomerType").value;

  if (!type) return showToast("Select Customer Type");

  try {
    const res = await fetch(`${BASE}/customer/controller/getCustomersByType/${type}`);
    const data = await res.json();

    const tbody = document.getElementById("customerTableBody");

    if (!data || data.length === 0) {
      showToast("No customers found");
      return;
    }

    tbody.innerHTML = data.map(c => `
      <tr>
        <td>${c.customerId}</td>
        <td>${c.customerName}</td>
        <td>${c.customerEmail}</td>
        <td>${c.customerType}</td>
      </tr>
    `).join("");

    document.getElementById("customerTableWrap").style.display = "block";

  } catch {
    showToast("Customer fetch failed");
  }
};

// =====================================================
// CUSTOMER UPDATE
// =====================================================
document.getElementById("btnUpdateCustomer").onclick = async () => {
  const id = document.getElementById("updCustId").value;
  const name = document.getElementById("updCustName").value;
  const email = document.getElementById("updCustEmail").value;
  const type = document.getElementById("updCustType").value;

  if (!id || !name || !email || !type)
    return showToast("Fill all fields");

  try {
    const res = await fetch(`${BASE}/customer/controller/updateCustomer`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: parseInt(id),
        customerName: name,
        customerEmail: email,
        customerType: type
      })
    });

    const text = await res.text();

    document.getElementById("updateCustomerResponse").innerText = text;
    document.getElementById("updateCustomerResponse").style.display = "block";

    showToast("Customer Updated Successfully");

  } catch {
    showToast("Customer update failed");
  }
};

// =====================================================
// ORDERS BY CUSTOMER ID
// =====================================================
document.getElementById("btnGetOrdersByCustomer").onclick = async () => {
  const id = document.getElementById("orderCustomerId").value;

  if (!id) return showToast("Enter Customer ID");

  try {
    const res = await fetch(`${BASE}/order/controller/getOrderDetailsByCustomerId/${id}`);
    const data = await res.json();

    const tbody = document.getElementById("orderByCustomerTableBody");

    if (!data || data.length === 0) {
      showToast("No orders found");
      return;
    }

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

  } catch {
    showToast("Orders fetch failed");
  }
};

// =====================================================
// ORDERS BY RANGE
// =====================================================
document.getElementById("btnGetOrdersByRange").onclick = async () => {
  const type = document.getElementById("rangeCustomerType").value;
  const min = document.getElementById("rangeMin").value;
  const max = document.getElementById("rangeMax").value;

  if (!type || !min || !max)
    return showToast("Fill all fields");

  try {
    const res = await fetch(`${BASE}/order/controller/getOrderDetailsByCustomerTypeAndBillInRange/${type}--${min}--${max}`);
    const data = await res.json();

    const tbody = document.getElementById("orderByRangeTableBody");

    if (!data || data.length === 0) {
      showToast("No orders found");
      return;
    }

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

  } catch {
    showToast("Range fetch failed");
  }
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
    return showToast("Fill all product fields");

  try {
    const res = await fetch(`${BASE}/product/controller/updateProductStock`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: parseInt(id),
        productName: name,
        price: parseFloat(price),
        stock: parseInt(stock)
      })
    });

    const text = await res.text();

    document.getElementById("updateStockResponse").innerText = text;
    document.getElementById("updateStockResponse").style.display = "block";

    showToast("Product Updated Successfully");

  } catch {
    showToast("Product update failed");
  }
};
