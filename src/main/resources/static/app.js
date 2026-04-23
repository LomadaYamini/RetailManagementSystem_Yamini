// ✅ BASE URL (auto local + production)
const BASE =
  window.location.hostname === 'localhost'
    ? 'http://localhost:8080'
    : 'https://retailmanagementspringbackend-production.up.railway.app';

// ── Toast ─────────────────────────────────────
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast toast-${type} show`;
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── Loading ───────────────────────────────────
function setLoading(btn, loading) {
  if (loading) {
    btn.dataset.old = btn.innerHTML;
    btn.innerHTML = "Loading...";
    btn.disabled = true;
  } else {
    btn.innerHTML = btn.dataset.old;
    btn.disabled = false;
  }
}

// ── Helpers ───────────────────────────────────
function typeBadge(type) {
  return `<span class="badge">${type}</span>`;
}

function fmt(val) {
  return val ? `₹${val}` : '—';
}

// ============================================================
// ✅ CUSTOMERS
// ============================================================
document.getElementById('btnGetCustomers').addEventListener('click', async () => {
  const type = document.getElementById('searchCustomerType').value;
  const tbody = document.getElementById('customerTableBody');
  const wrap = document.getElementById('customerTableWrap');
  const empty = document.getElementById('customerEmpty');
  const btn = document.getElementById('btnGetCustomers');

  if (!type) return showToast("Select type", "error");

  setLoading(btn, true);
  wrap.style.display = 'none';
  empty.style.display = 'none';

  try {
    const res = await fetch(`${BASE}/customer/controller/getCustomersByType/${type}`);
    const data = await res.json();

    if (!data.length) {
      empty.style.display = 'block';
      return;
    }

    tbody.innerHTML = data.map(c => `
      <tr>
        <td>${c.customerId}</td>
        <td>${c.customerName}</td>
        <td>${c.customerEmail}</td>
        <td>${typeBadge(c.customerType)}</td>
      </tr>
    `).join('');

    wrap.style.display = 'block';

  } catch {
    showToast("Customer fetch failed", "error");
  } finally {
    setLoading(btn, false);
  }
});

// ============================================================
// ✅ UPDATE CUSTOMER
// ============================================================
document.getElementById('btnUpdateCustomer').addEventListener('click', async () => {
  const id = document.getElementById('updCustId').value;
  const name = document.getElementById('updCustName').value;
  const email = document.getElementById('updCustEmail').value;
  const type = document.getElementById('updCustType').value;

  if (!id || !name || !email || !type)
    return showToast("Fill all fields", "error");

  try {
    const res = await fetch(`${BASE}/customer/controller/updateCustomer`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId: id,
        customerName: name,
        customerEmail: email,
        customerType: type
      })
    });

    const text = await res.text();
    showToast(text, "success");

  } catch {
    showToast("Update failed", "error");
  }
});

// ============================================================
// ✅ ORDERS BY CUSTOMER ID
// ============================================================
document.getElementById('btnGetOrdersByCustomer').addEventListener('click', async () => {
  const id = document.getElementById('orderCustomerId').value;
  const tbody = document.getElementById('orderByCustomerTableBody');
  const wrap = document.getElementById('orderByCustomerTableWrap');
  const empty = document.getElementById('orderByCustomerEmpty');
  const btn = document.getElementById('btnGetOrdersByCustomer');

  if (!id) return showToast("Enter Customer ID", "error");

  setLoading(btn, true);
  wrap.style.display = 'none';
  empty.style.display = 'none';

  try {
    const res = await fetch(`${BASE}/order/controller/getOrderDetailsByCustomerId/${id}`);
    const data = await res.json();

    if (!data.length) {
      empty.style.display = 'block';
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
        <td>${fmt(o.billingAmount)}</td>
      </tr>
    `).join('');

    wrap.style.display = 'block';

  } catch {
    showToast("Orders fetch failed", "error");
  } finally {
    setLoading(btn, false);
  }
});

// ============================================================
// ✅ ORDERS BY RANGE
// ============================================================
document.getElementById('btnGetOrdersByRange').addEventListener('click', async () => {
  const type = document.getElementById('rangeCustomerType').value;
  const min = document.getElementById('rangeMin').value;
  const max = document.getElementById('rangeMax').value;

  const tbody = document.getElementById('orderByRangeTableBody');
  const wrap = document.getElementById('orderByRangeTableWrap');

  if (!type || !min || !max)
    return showToast("Fill all fields", "error");

  try {
    const res = await fetch(`${BASE}/order/controller/getOrderDetailsByCustomerTypeAndBillInRange/${type}--${min}--${max}`);
    const data = await res.json();

    if (!data.length) {
      showToast("No orders found", "info");
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
        <td>${fmt(o.billingAmount)}</td>
      </tr>
    `).join('');

    wrap.style.display = 'block';

  } catch {
    showToast("Range fetch failed", "error");
  }
});

// ============================================================
// ✅ PRODUCT UPDATE
// ============================================================
document.getElementById('btnUpdateStock').addEventListener('click', async () => {
  const id = document.getElementById('prodId').value;
  const name = document.getElementById('prodName').value;
  const price = document.getElementById('prodPrice').value;
  const stock = document.getElementById('prodStock').value;

  if (!id || !name || !price || !stock)
    return showToast("Fill all product fields", "error");

  try {
    const res = await fetch(`${BASE}/product/controller/updateProductStock`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: id,
        productName: name,
        price: price,
        stock: stock
      })
    });

    const text = await res.text();
    document.getElementById('updateStockResponse').style.display = 'block';
    document.getElementById('updateStockResponse').innerText = text;

    showToast("Product updated!", "success");

  } catch {
    showToast("Product update failed", "error");
  }
});
