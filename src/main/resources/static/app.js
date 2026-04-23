const BASE = 'http://localhost:8080';   // explicitly point to Spring Boot backend

// ── Utility: Toast ──────────────────────────────────────────
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast toast-${type} show`;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

// ── Utility: Loading state ───────────────────────────────────
function setLoading(btn, loading) {
  if (loading) {
    btn.classList.add('loading');
    btn.dataset.orig = btn.innerHTML;
    btn.innerHTML = '<span>Loading…</span><span class="btn-icon">⏳</span>';
  } else {
    btn.classList.remove('loading');
    if (btn.dataset.orig) btn.innerHTML = btn.dataset.orig;
  }
}

// ── Utility: Customer type badge ─────────────────────────────
function typeBadge(type) {
  const cls = {
    'Platinum': 'badge-platinum',
    'Gold': 'badge-gold',
    'Silver': 'badge-silver'
  }[type] || '';
  return `<span class="badge ${cls}">${type || '—'}</span>`;
}

// ── Utility: Format currency ─────────────────────────────────
function fmt(val) {
  return val !== undefined && val !== null
    ? `₹${parseFloat(val).toFixed(2)}`
    : '—';
}

// ── Utility: show/hide response box ─────────────────────────
function showResponse(boxId, message, isError) {
  const box = document.getElementById(boxId);
  box.textContent = message;
  box.className = `response-box ${isError ? 'error' : 'success'}`;
  box.style.display = 'block';
}

// ── Navigation ───────────────────────────────────────────────
const sections = ['customers', 'orders', 'products'];
const pageMeta = {
  customers: { title: 'Customer Management', sub: 'Search and manage customer records' },
  orders: { title: 'Order Management', sub: 'View and filter order records' },
  products: { title: 'Product Management', sub: 'Update product stock levels' },
};

function switchSection(name) {
  sections.forEach(s => {
    document.getElementById(`section-${s}`).classList.toggle('hidden', s !== name);
    document.getElementById(`nav-${s}`).classList.toggle('active', s === name);
  });
  document.getElementById('pageTitle').textContent = pageMeta[name].title;
  document.getElementById('pageSub').textContent = pageMeta[name].sub;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.nav-item').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    switchSection(link.dataset.section);
  });
});

// ── Server health check ──────────────────────────────────────
async function checkServer() {
  const dot = document.getElementById('statusDot');
  const text = document.getElementById('statusText');
  try {
    // A lightweight ping – we'll try the customer endpoint with a known type
    const res = await fetch(`${BASE}/customer/controller/getCustomersByType/Platinum`, {
      method: 'GET', signal: AbortSignal.timeout(4000)
    });
    if (res.ok || res.status === 404) {
      dot.className = 'status-dot online';
      text.textContent = 'Server Online';
    } else {
      throw new Error('Non-OK');
    }
  } catch {
    dot.className = 'status-dot offline';
    text.textContent = 'Server Offline';
  }
}

checkServer();
setInterval(checkServer, 30000);

// ============================================================
// CUSTOMERS
// ============================================================

// ── GET Customers by Type ────────────────────────────────────
document.getElementById('btnGetCustomers').addEventListener('click', async () => {
  const btn = document.getElementById('btnGetCustomers');
  const type = document.getElementById('searchCustomerType').value.trim();
  const tableWrap = document.getElementById('customerTableWrap');
  const tbody = document.getElementById('customerTableBody');
  const emptyState = document.getElementById('customerEmpty');

  if (!type) {
    showToast('Please select a customer type.', 'error');
    return;
  }

  tableWrap.style.display = 'none';
  emptyState.style.display = 'none';
  setLoading(btn, true);

  try {
    const res = await fetch(`${BASE}/customer/controller/getCustomersByType/${encodeURIComponent(type)}`);

    if (res.status === 404) {
      emptyState.style.display = 'block';
      showToast('No customers found for this type.', 'info');
      return;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    if (!data || data.length === 0) {
      emptyState.style.display = 'block';
      showToast('No customers found.', 'info');
      return;
    }

    tbody.innerHTML = data.map(c => `
      <tr>
        <td>${c.customerId}</td>
        <td>${c.customerName || '—'}</td>
        <td>${c.customerEmail || '—'}</td>
        <td>${typeBadge(c.customerType)}</td>
      </tr>
    `).join('');

    tableWrap.style.display = 'block';
    showToast(`Found ${data.length} customer(s).`, 'success');

  } catch (err) {
    showToast(`Error: ${err.message}`, 'error');
  } finally {
    setLoading(btn, false);
  }
});

// ── PUT Update Customer Type ─────────────────────────────────
document.getElementById('btnUpdateCustomer').addEventListener('click', async () => {
  const btn = document.getElementById('btnUpdateCustomer');
  const id = document.getElementById('updCustId').value.trim();
  const name = document.getElementById('updCustName').value.trim();
  const email = document.getElementById('updCustEmail').value.trim();
  const type = document.getElementById('updCustType').value.trim();

  if (!id || !name || !email || !type) {
    showToast('Please fill in all fields before updating.', 'error');
    return;
  }

  const payload = {
    customerId: parseInt(id, 10),
    customerName: name,
    customerEmail: email,
    customerType: type
  };

  setLoading(btn, true);
  document.getElementById('updateCustomerResponse').style.display = 'none';

  try {
    const res = await fetch(`${BASE}/customer/controller/updateCustomer`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const text = await res.text();
    if (!res.ok) throw new Error(text || `HTTP ${res.status}`);

    showResponse('updateCustomerResponse', `✅ ${text}`, false);
    showToast('Customer updated successfully!', 'success');

    // Clear fields
    ['updCustId', 'updCustName', 'updCustEmail'].forEach(id => {
      document.getElementById(id).value = '';
    });
    document.getElementById('updCustType').value = '';

  } catch (err) {
    showResponse('updateCustomerResponse', `❌ ${err.message}`, true);
    showToast('Update failed. Check the details.', 'error');
  } finally {
    setLoading(btn, false);
  }
});

// ============================================================
// ORDERS
// ============================================================

// ── GET Orders by Customer ID ────────────────────────────────
document.getElementById('btnGetOrdersByCustomer').addEventListener('click', async () => {
  const btn = document.getElementById('btnGetOrdersByCustomer');
  const custId = document.getElementById('orderCustomerId').value.trim();
  const tableWrap = document.getElementById('orderByCustomerTableWrap');
  const tbody = document.getElementById('orderByCustomerTableBody');
  const emptyState = document.getElementById('orderByCustomerEmpty');

  if (!custId) {
    showToast('Please enter a Customer ID.', 'error');
    return;
  }

  tableWrap.style.display = 'none';
  emptyState.style.display = 'none';
  setLoading(btn, true);

  try {
    const res = await fetch(`${BASE}/order/controller/getOrderDetailsByCustomerId/${encodeURIComponent(custId)}`);

    if (res.status === 404) {
      emptyState.style.display = 'block';
      showToast('No orders found for this customer.', 'info');
      return;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    if (!data || data.length === 0) {
      emptyState.style.display = 'block';
      showToast('No orders found.', 'info');
      return;
    }

    tbody.innerHTML = data.map(o => `
      <tr>
        <td>${o.orderId}</td>
        <td>${o.customerId}</td>
        <td>${o.customerEmail || '—'}</td>
        <td>${o.productName || o.productId || '—'}</td>
        <td>${o.quantity}</td>
        <td>${o.orderDate || '—'}</td>
        <td>${fmt(o.billingAmount)}</td>
      </tr>
    `).join('');

    tableWrap.style.display = 'block';
    showToast(`Found ${data.length} order(s).`, 'success');

  } catch (err) {
    showToast(`Error: ${err.message}`, 'error');
  } finally {
    setLoading(btn, false);
  }
});

// ── GET Orders by Customer Type & Bill Range ─────────────────
document.getElementById('btnGetOrdersByRange').addEventListener('click', async () => {
  const btn = document.getElementById('btnGetOrdersByRange');
  const type = document.getElementById('rangeCustomerType').value.trim();
  const min = document.getElementById('rangeMin').value.trim();
  const max = document.getElementById('rangeMax').value.trim();
  const tableWrap = document.getElementById('orderByRangeTableWrap');
  const tbody = document.getElementById('orderByRangeTableBody');
  const emptyState = document.getElementById('orderByRangeEmpty');

  if (!type || min === '' || max === '') {
    showToast('Please fill in all search fields.', 'error');
    return;
  }

  if (parseFloat(min) > parseFloat(max)) {
    showToast('Minimum amount cannot be greater than maximum.', 'error');
    return;
  }

  tableWrap.style.display = 'none';
  emptyState.style.display = 'none';
  setLoading(btn, true);

  try {
    const url = `${BASE}/order/controller/getOrderDetailsByCustomerTypeAndBillInRange/${encodeURIComponent(type)}--${encodeURIComponent(min)}--${encodeURIComponent(max)}`;
    const res = await fetch(url);

    if (res.status === 404) {
      emptyState.style.display = 'block';
      showToast('No orders found matching the criteria.', 'info');
      return;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    if (!data || data.length === 0) {
      emptyState.style.display = 'block';
      showToast('No orders found.', 'info');
      return;
    }

    tbody.innerHTML = data.map(o => `
      <tr>
        <td>${o.orderId}</td>
        <td>${o.customerId}</td>
        <td>${o.customerEmail || '—'}</td>
        <td>${o.productName || o.productId || '—'}</td>
        <td>${o.quantity}</td>
        <td>${o.orderDate || '—'}</td>
        <td>${fmt(o.billingAmount)}</td>
      </tr>
    `).join('');

    tableWrap.style.display = 'block';
    showToast(`Found ${data.length} order(s).`, 'success');

  } catch (err) {
    showToast(`Error: ${err.message}`, 'error');
  } finally {
    setLoading(btn, false);
  }
});

// ============================================================
// PRODUCTS
// ============================================================

// ── PUT Update Product Stock ─────────────────────────────────
document.getElementById('btnUpdateStock').addEventListener('click', async () => {
  const btn = document.getElementById('btnUpdateStock');
  const id = document.getElementById('prodId').value.trim();
  const name = document.getElementById('prodName').value.trim();
  const price = document.getElementById('prodPrice').value.trim();
  const stock = document.getElementById('prodStock').value.trim();

  if (!id || !name || !price || stock === '') {
    showToast('Please fill in all product fields.', 'error');
    return;
  }

  const payload = {
    productId: parseInt(id, 10),
    productName: name,
    price: parseFloat(price),
    stock: parseInt(stock, 10)
  };

  setLoading(btn, true);
  document.getElementById('updateStockResponse').style.display = 'none';

  try {
    const res = await fetch(`${BASE}/product/controller/updateProductStock`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const text = await res.text();
    if (!res.ok) throw new Error(text || `HTTP ${res.status}`);

    showResponse('updateStockResponse', `✅ ${text}`, false);
    showToast('Product stock updated successfully!', 'success');

    // Clear fields
    ['prodId', 'prodName', 'prodPrice', 'prodStock'].forEach(fid => {
      document.getElementById(fid).value = '';
    });

  } catch (err) {
    showResponse('updateStockResponse', `❌ ${err.message}`, true);
    showToast('Stock update failed. Check the details.', 'error');
  } finally {
    setLoading(btn, false);
  }
});
