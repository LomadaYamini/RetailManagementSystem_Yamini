// ✅ AUTO-DETECT BASE URL (local + production)
const BASE =
  window.location.hostname === 'localhost'
    ? 'http://localhost:8080'
    : 'https://retailmanagementspringbackend-production.up.railway.app';

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

// ── Utility: Badge ───────────────────────────────────────────
function typeBadge(type) {
  const cls = {
    Platinum: 'badge-platinum',
    Gold: 'badge-gold',
    Silver: 'badge-silver'
  }[type] || '';
  return `<span class="badge ${cls}">${type || '—'}</span>`;
}

// ── Utility: Currency ───────────────────────────────────────
function fmt(val) {
  return val !== undefined && val !== null
    ? `₹${parseFloat(val).toFixed(2)}`
    : '—';
}

// ── Utility: Response Box ───────────────────────────────────
function showResponse(boxId, message, isError) {
  const box = document.getElementById(boxId);
  box.textContent = message;
  box.className = `response-box ${isError ? 'error' : 'success'}`;
  box.style.display = 'block';
}

// ── Navigation ──────────────────────────────────────────────
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
}

document.querySelectorAll('.nav-item').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    switchSection(link.dataset.section);
  });
});

// ── Server health check ─────────────────────────────────────
async function checkServer() {
  const dot = document.getElementById('statusDot');
  const text = document.getElementById('statusText');

  try {
    const res = await fetch(`${BASE}/customer/controller/getCustomersByType/Platinum`, {
      method: 'GET',
      signal: AbortSignal.timeout(4000)
    });

    if (res.ok || res.status === 404) {
      dot.className = 'status-dot online';
      text.textContent = 'Server Online';
    } else {
      throw new Error();
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

// ✅ GET Customers by Type
document.getElementById('btnGetCustomers').addEventListener('click', async () => {
  const btn = document.getElementById('btnGetCustomers');
  const type = document.getElementById('searchCustomerType').value.trim();

  const tableWrap = document.getElementById('customerTableWrap');
  const tbody = document.getElementById('customerTableBody');
  const emptyState = document.getElementById('customerEmpty');

  if (!type) {
    showToast('Select customer type', 'error');
    return;
  }

  setLoading(btn, true);
  tableWrap.style.display = 'none';
  emptyState.style.display = 'none';

  try {
    const res = await fetch(`${BASE}/customer/controller/getCustomersByType/${type}`);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    // ❌ No data
    if (!data || data.length === 0) {
      emptyState.style.display = 'block';
      showToast("No customers found", "info");
      return;
    }

    // ✅ Show table
    tbody.innerHTML = data.map(c => `
      <tr>
        <td>${c.customerId}</td>
        <td>${c.customerName || '—'}</td>
        <td>${c.customerEmail || '—'}</td>
        <td>${typeBadge(c.customerType)}</td>
      </tr>
    `).join('');

    tableWrap.style.display = 'block';
    showToast(`Found ${data.length} customers`, 'success');

  } catch (err) {
    showToast(`Error: ${err.message}`, 'error');
  } finally {
    setLoading(btn, false);
  }
});

// ✅ UPDATE Customer
document.getElementById('btnUpdateCustomer').addEventListener('click', async () => {
  const btn = document.getElementById('btnUpdateCustomer');

  const id = document.getElementById('updCustId').value.trim();
  const name = document.getElementById('updCustName').value.trim();
  const email = document.getElementById('updCustEmail').value.trim();
  const type = document.getElementById('updCustType').value.trim();

  if (!id || !name || !email || !type) {
    showToast("Fill all fields", "error");
    return;
  }

  setLoading(btn, true);
  document.getElementById('updateCustomerResponse').style.display = 'none';

  try {
    const res = await fetch(`${BASE}/customer/controller/updateCustomer`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId: parseInt(id),
        customerName: name,
        customerEmail: email,
        customerType: type
      })
    });

    const text = await res.text();

    if (!res.ok) throw new Error(text);

    showResponse('updateCustomerResponse', text, false);
    showToast("Customer updated!", "success");

  } catch (err) {
    showResponse('updateCustomerResponse', err.message, true);
    showToast("Update failed", "error");
  } finally {
    setLoading(btn, false);
  }
});
