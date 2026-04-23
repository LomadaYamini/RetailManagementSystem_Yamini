// ✅ AUTO-DETECT BASE URL (works locally + production)
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

// GET Customers
document.getElementById('btnGetCustomers').addEventListener('click', async () => {
  const btn = document.getElementById('btnGetCustomers');
  const type = document.getElementById('searchCustomerType').value.trim();

  if (!type) {
    showToast('Select customer type', 'error');
    return;
  }

  setLoading(btn, true);

  try {
    const res = await fetch(`${BASE}/customer/controller/getCustomersByType/${type}`);
    const data = await res.json();

    console.log(data);
    showToast("Data fetched!", "success");

  } catch (err) {
    showToast("Error connecting server", "error");
  } finally {
    setLoading(btn, false);
  }
});

// UPDATE Customer
document.getElementById('btnUpdateCustomer').addEventListener('click', async () => {
  const id = document.getElementById('updCustId').value;
  const name = document.getElementById('updCustName').value;
  const email = document.getElementById('updCustEmail').value;
  const type = document.getElementById('updCustType').value;

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
