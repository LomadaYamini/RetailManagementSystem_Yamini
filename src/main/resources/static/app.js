// ✅ BACKEND URL
const BASE = "https://retailmanagementspringbackend-production.up.railway.app";

// =====================================================
// SIMPLE ALERT (stable, no UI bugs)
// =====================================================
function show(msg) {
  alert(msg);
}

// =====================================================
// NAVIGATION (WORKING)
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
// CUSTOMERS - GET BY TYPE
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
    const res = await fetch(`${BASE}/customer/controller/getCustomersByType/${type}`);
    const data = await res.json();

    if (!data || data.length === 0) {
      empty.style.display = "block";
      return;
    }

    data.forEach(c => {
      tbody.innerHTML += `
        <tr>
          <td>${c.customerId}</td>
          <td>${c.customerName}</td>
          <td>${c.customerEmail}</td>
          <td>${c.customerType}</td>
        </tr>
      `;
    });

    wrap.style.display = "block";

  } catch {
    show("Customer fetch failed");
  }
};

// =====================================================
// UPDATE CUSTOMER
// =====================================================
document.getElementById("btnUpdateCustomer").onclick = async () => {
  const id = document.getElementById("updCustId").value;
  const name = document.getElementById("updCustName").value;
  const email = document.getElementById("updCustEmail").value;
  const type = document.getElementById("updCustType").value;

  if (!id || !name || !email || !type)
    return show("Fill all fields");

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

    show("Customer Updated");

  } catch {
    show("Customer update failed");
  }
};

// =====================================================
// ORDERS - BY CUSTOMER ID
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
    const res = await fetch(`${BASE}/order/controller/getOrderDetailsByCustomerId/${id}`);
    const data = await res.json();

    if (!data || data.length === 0) {
      empty.style.display = "block";
      return;
    }

    data.forEach(o => {
      tbody.innerHTML += `
        <tr>
          <td>${o.orderId}</td>
          <td>${o.customerId}</td>
          <td>${o.customerEmail || '-'}</td>
          <td>${o.productName || '-'}</td>
          <td>${o.quantity}</td>
          <td>${o.orderDate || '-'}</td>
          <td>${o.billingAmount}</td>
        </tr>
      `;
    });

    wrap.style.display = "block";

  } catch {
    show("Orders fetch failed");
  }
};

// =====================================================
// ORDERS - TYPE & BILL RANGE
// =====================================================
document.getElementById("btnGetOrdersByRange").onclick = async () => {
  const type = document.getElementById("rangeCustomerType").value;
  const min = document.getElementById("rangeMin").value;
  const max = document.getElementById("rangeMax").value;

  const tbody = document.getElementById("orderByRangeTableBody");
  const wrap = document.getElementById("orderByRangeTableWrap");

  tbody.innerHTML = "";
  wrap.style.display = "none";

  if (!type || !min || !max)
    return show("Fill all fields");

  try {
    const res = await fetch(`${BASE}/order/controller/getOrderDetailsByCustomerTypeAndBillInRange/${type}--${min}--${max}`);
    const data = await res.json();

    if (!data || data.length === 0) {
      show("No orders found");
      return;
    }

    data.forEach(o => {
      tbody.innerHTML += `
        <tr>
          <td>${o.orderId}</td>
          <td>${o.customerId}</td>
          <td>${o.customerEmail}</td>
          <td>${o.productName}</td>
          <td>${o.quantity}</td>
          <td>${o.orderDate}</td>
          <td>${o.billingAmount}</td>
        </tr>
      `;
    });

    wrap.style.display = "block";

  } catch {
    show("Range fetch failed");
  }
};

// =====================================================
// PRODUCT - UPDATE STOCK
// =====================================================
document.getElementById("btnUpdateStock").onclick = async () => {
  const id = document.getElementById("prodId").value;
  const name = document.getElementById("prodName").value;
  const price = document.getElementById("prodPrice").value;
  const stock = document.getElementById("prodStock").value;

  if (!id || !name || !price || !stock)
    return show("Fill all product fields");

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

    show("Product Updated");

  } catch {
    show("Product update failed");
  }
};
