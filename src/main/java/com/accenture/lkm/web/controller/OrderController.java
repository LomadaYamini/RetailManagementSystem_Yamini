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

    console.log("Calling:", url); // DEBUG

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
