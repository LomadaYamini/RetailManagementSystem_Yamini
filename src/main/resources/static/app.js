// =====================================================
// ✅ AUTO BACKEND URL
// =====================================================
const BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:8080"
    : "https://retailmanagementspringbackend-production.up.railway.app";

// =====================================================
// ✅ SIMPLE MESSAGE
// =====================================================
function show(msg) {
  alert(msg);
}

// =====================================================
// ✅ NAVIGATION
// =====================================================
document.querySelectorAll(".nav-item").forEach(item => {
  item.onclick = function (e) {
    e.preventDefault();

    document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
    document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));

    document.getElementById("section-" + this.dataset.section).classList.remove("hidden");
    this.classList.add("active");
  };
});

// =====================================================
// ✅ SERVER STATUS (FIXED)
// =====================================================
async function checkServer() {
  const text = document.getElementById("statusText");
  const dot = document.getElementById("statusDot");

  try {
    const res = await fetch(`${BASE}/customer/controller/getCustomersByType/Gold`);

    if (res.ok || res.status === 404) {
      text.innerText = "Server Online";
      dot.style.background = "green";
    } else {
      throw new Error();
    }
  } catch {
    text.innerText = "Server Offline";
    dot.style.background = "red";
  }
}
checkServer();
setInterval(checkServer, 10000);

// =====================================================
// ✅ SAFE FETCH HELPER (IMPORTANT FIX)
// =====================================================
async function safeFetch(url, options = {}) {
  const res = await fetch(url, options);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  // handle empty body safely
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return await res.json();
  } else {
    return await res.text();
  }
}

// =====================================================
// ✅ CUSTOMERS
// =====================================================
document.getElementById("btnGetCustomers").onclick = async () => {
  const type = document.getElementById("searchCustomerType").value;

  const tbody = document.getElementById("customerTableBody");
  const wrap = document.getElementById("customerTableWrap");
  const empty = document.getElementById("customerEmpty");

  tbody.innerHTML = "";
  wrap.style.display = "none";
  empty.style.display = "none";

  if (!type) return show("Select Customer Type");

  try {
    const data = await safeFetch(`${BASE}/customer/controller/getCustomersByType/${type}`);

    if (!data || data.length === 0) {
      empty.style.display = "block";
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

    wrap.style.display = "block";

  } catch (err) {
    show("Customer fetch failed: " + err.message);
  }
};

// =====================================================
// ✅ UPDATE CUSTOMER
// =====================================================
document.getElementById("btnUpdateCustomer").onclick = async () => {
  const id = document.getElementById("updCustId").value;
  const name = document.getElementById("updCustName").value;
  const email = document.getElementById("updCustEmail").value;
  const type = document.getElementById("updCustType").value;

  if (!id || !name || !email || !type)
    return show("Fill all fields");

  try {
    const msg = await safeFetch(`${BASE}/customer/controller/updateCustomer`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: Number(id),
        customerName: name,
        customerEmail: email,
        customerType: type
      })
    });

    document.getElementById("updateCustomerResponse").innerText = msg;
    document.getElementById("updateCustomerResponse").style.display = "block";

    show("Customer Updated");

  } catch (err) {
    show("Update failed: " + err.message);
  }
};

// =====================================================
// ✅ ORDERS BY CUSTOMER ID
// =====================================================
document.getElementById("btnGetOrdersByCustomer").onclick = async () => {
  const id = document.getElementById("orderCustomerId").value;

  const tbody = document.getElementById("orderByCustomerTableBody");
  const wrap = document.getElementById("orderByCustomerTableWrap");
  const empty = document.getElementById("orderByCustomerEmpty");

  tbody.innerHTML = "";
  wrap.style.display = "none";
  empty.style.display = "none";

  if (!id) return show("Enter Customer ID");

  try {
    const data = await safeFetch(`${BASE}/order/controller/getOrderDetailsByCustomerId/${id}`);

    if (!data || data.length === 0) {
      empty.style.display = "block";
      return;
    }

    tbody.innerHTML = data.map(o => `
      <tr>
        <td>${o.orderId}</td>
        <td>${o.customerId}</td>
        <td>${o.customerEmail || '-'}</td>
        <td>${o.productName || '-'}</td>
        <td>${o.quantity}</td>
        <td>${o.orderDate || '-'}</td>
        <td>${o.billingAmount}</td>
      </tr>
    `).join("");

    wrap.style.display = "block";

  } catch (err) {
    show("Orders fetch failed: " + err.message);
  }
};

// =====================================================
// ✅ ORDERS BY TYPE + RANGE (FIXED PROPERLY)
// =====================================================
document.getElementById("btnGetOrdersByRange").onclick = async () => {
  const type = document.getElementById("rangeCustomerType").value;
  const min = document.getElementById("rangeMin").value;
  const max = document.getElementById("rangeMax").value;

  const tbody = document.getElementById("orderByRangeTableBody");
  const wrap = document.getElementById("orderByRangeTableWrap");

  tbody.innerHTML = "";
  wrap.style.display = "none";

  if (!type || min === "" || max === "")
    return show("Fill all fields");

  if (Number(min) > Number(max))
    return show("Min cannot be greater than Max");

  try {
    const url = `${BASE}/order/controller/getOrderDetailsByCustomerTypeAndBillInRange/${encodeURIComponent(type)}--${min}--${max}`;

    console.log("Calling:", url); // DEBUG

    const data = await safeFetch(url);

    if (!data || data.length === 0) {
      show("No orders found");
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

    wrap.style.display = "block";

  } catch (err) {
    show("Range fetch failed: " + err.message);
  }
};

// =====================================================
// ✅ PRODUCT UPDATE
// =====================================================
document.getElementById("btnUpdateStock").onclick = async () => {
  const id = document.getElementById("prodId").value;
  const name = document.getElementById("prodName").value;
  const price = document.getElementById("prodPrice").value;
  const stock = document.getElementById("prodStock").value;

  if (!id || !name || !price || !stock)
    return show("Fill all fields");

  try {
    const msg = await safeFetch(`${BASE}/product/controller/updateProductStock`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: Number(id),
        productName: name,
        price: Number(price),
        stock: Number(stock)
      })
    });

    document.getElementById("updateStockResponse").innerText = msg;
    document.getElementById("updateStockResponse").style.display = "block";

    show("Product Updated");

  } catch (err) {
    show("Product update failed: " + err.message);
  }
};
