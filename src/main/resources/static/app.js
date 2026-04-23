// ✅ AUTO-DETECT BASE URL
const BASE =
  window.location.hostname === 'localhost'
    ? 'http://localhost:8080'
    : 'https://retailmanagementspringbackend-production.up.railway.app';

// ==========================
// GET CUSTOMERS
// ==========================
btnGetCustomers.onclick = async () => {
  const type = searchCustomerType.value;

  if (!type) {
    alert("Select type");
    return;
  }

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
};

// ==========================
// UPDATE CUSTOMER
// ==========================
btnUpdateCustomer.onclick = async () => {
  const payload = {
    customerId: updCustId.value,
    customerName: updCustName.value,
    customerEmail: updCustEmail.value,
    customerType: updCustType.value
  };

  const res = await fetch(`${BASE}/customer/controller/updateCustomer`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  alert(await res.text());
};

// ==========================
// GET ORDERS BY CUSTOMER ID
// ==========================
btnGetOrdersByCustomer.onclick = async () => {
  const id = orderCustomerId.value;

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
};

// ==========================
// ✅ FIXED RANGE API (IMPORTANT)
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
