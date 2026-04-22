const BASE_URL = 'http://localhost:8080'; // Backend API

// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.content-section');
const toastContainer = document.getElementById('toast-container');

// -----------------------------------------------------------------------------
// Navigation Logic
// -----------------------------------------------------------------------------
navItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove active class from all
        navItems.forEach(nav => nav.classList.remove('active'));
        sections.forEach(sec => sec.classList.remove('active'));

        // Add active class to clicked item and target section
        item.classList.add('active');
        const targetId = item.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
    });
});

// -----------------------------------------------------------------------------
// Toast Notification
// -----------------------------------------------------------------------------
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? '✅' : '❌';
    toast.innerHTML = `<span class="icon">${icon}</span> <span>${message}</span>`;
    
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// -----------------------------------------------------------------------------
// Generic Table Renderer
// -----------------------------------------------------------------------------
function renderTable(data, containerId, emptyMessage = "No records found.") {
    const container = document.getElementById(containerId);
    if (!data || data.length === 0) {
        container.innerHTML = `<p class="error-text">${emptyMessage}</p>`;
        return;
    }

    // Extract headers from first object
    const headers = Object.keys(data[0]);
    
    let tableHTML = `<table>
        <thead>
            <tr>
                ${headers.map(header => `<th>${header.replace(/([A-Z])/g, ' $1').trim()}</th>`).join('')}
            </tr>
        </thead>
        <tbody>`;

    data.forEach(row => {
        tableHTML += '<tr>';
        headers.forEach(header => {
            let value = row[header];
            if (value === null || value === undefined) value = '-';
            
            // Format specific column types if needed
            if (header.toLowerCase().includes('type')) {
                tableHTML += `<td><span class="badge">${value}</span></td>`;
            } else if (header.toLowerCase().includes('price') || header.toLowerCase().includes('bill')) {
                tableHTML += `<td>$${parseFloat(value).toFixed(2)}</td>`;
            } else {
                tableHTML += `<td>${value}</td>`;
            }
        });
        tableHTML += '</tr>';
    });

    tableHTML += `</tbody></table>`;
    container.innerHTML = tableHTML;
}

// -----------------------------------------------------------------------------
// API Endpoints Implementation
// -----------------------------------------------------------------------------

// 1. Update Product Stock (PUT)
document.getElementById('update-product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const resultDiv = document.getElementById('product-result');
    const payload = {
        productId: parseInt(document.getElementById('product-id').value),
        productName: document.getElementById('product-name').value,
        price: parseFloat(document.getElementById('product-price').value),
        stock: parseInt(document.getElementById('product-stock').value)
    };

    try {
        const response = await fetch(`${BASE_URL}/product/controller/updateProductStock`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const text = await response.text();
            showToast(text, 'success');
            resultDiv.innerHTML = `<p class="success-text">✅ ${text}</p>`;
            e.target.reset();
        } else {
            throw new Error('Failed to update product stock');
        }
    } catch (error) {
        showToast(error.message, 'error');
        resultDiv.innerHTML = `<p class="error-text">❌ ${error.message}</p>`;
    }
});

// 2. Get Customers By Type (GET)
document.getElementById('get-customers-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const type = document.getElementById('search-customer-type').value;
    const containerId = 'customers-list-result';

    try {
        document.getElementById(containerId).innerHTML = '<p>Loading...</p>';
        const response = await fetch(`${BASE_URL}/customer/controller/getCustomersByType/${encodeURIComponent(type)}`);
        
        if (response.ok) {
            const data = await response.json();
            renderTable(data, containerId, `No customers found for type: ${type}`);
            showToast(`Found ${data.length} customers`, 'success');
        } else if (response.status === 404) {
            document.getElementById(containerId).innerHTML = `<p class="error-text">No customers found.</p>`;
        } else {
            throw new Error('Failed to fetch customers');
        }
    } catch (error) {
        showToast(error.message, 'error');
        document.getElementById(containerId).innerHTML = `<p class="error-text">❌ ${error.message}</p>`;
    }
});

// 3. Update Customer Type (PUT)
document.getElementById('update-customer-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const resultDiv = document.getElementById('customer-update-result');
    const payload = {
        customerId: parseInt(document.getElementById('update-customer-id').value),
        customerName: document.getElementById('update-customer-name').value,
        customerEmail: document.getElementById('update-customer-email').value,
        customerType: document.getElementById('update-customer-type-select').value
    };

    try {
        const response = await fetch(`${BASE_URL}/customer/controller/updateCustomer`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const text = await response.text();
            showToast('Customer updated successfully', 'success');
            resultDiv.innerHTML = `<p class="success-text">✅ ${text}</p>`;
            e.target.reset();
        } else {
            throw new Error('Failed to update customer');
        }
    } catch (error) {
        showToast(error.message, 'error');
        resultDiv.innerHTML = `<p class="error-text">❌ ${error.message}</p>`;
    }
});

// 4. Get Orders By Customer ID (GET)
document.getElementById('orders-by-id-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const customerId = document.getElementById('order-customer-id').value;
    const containerId = 'orders-by-id-result';

    try {
        document.getElementById(containerId).innerHTML = '<p>Loading...</p>';
        const response = await fetch(`${BASE_URL}/order/controller/getOrderDetailsByCustomerId/${customerId}`);
        
        if (response.ok) {
            const data = await response.json();
            renderTable(data, containerId, `No orders found for Customer ID: ${customerId}`);
        } else if (response.status === 404) {
            document.getElementById(containerId).innerHTML = `<p class="error-text">No orders found.</p>`;
        } else {
            throw new Error('Failed to fetch orders');
        }
    } catch (error) {
        showToast(error.message, 'error');
        document.getElementById(containerId).innerHTML = `<p class="error-text">❌ ${error.message}</p>`;
    }
});

// 5. Get Orders By Customer Type & Bill Range (GET)
document.getElementById('orders-by-range-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const type = document.getElementById('range-customer-type').value;
    const min = document.getElementById('range-min').value;
    const max = document.getElementById('range-max').value;
    const containerId = 'orders-by-range-result';

    try {
        document.getElementById(containerId).innerHTML = '<p>Loading...</p>';
        const response = await fetch(`${BASE_URL}/order/controller/getOrderDetailsByCustomerTypeAndBillInRange/${encodeURIComponent(type)}--${min}--${max}`);
        
        if (response.ok) {
            const data = await response.json();
            renderTable(data, containerId, `No orders found in range $${min} - $${max} for type ${type}`);
        } else if (response.status === 404) {
            document.getElementById(containerId).innerHTML = `<p class="error-text">No orders found.</p>`;
        } else {
            throw new Error('Failed to fetch orders');
        }
    } catch (error) {
        showToast(error.message, 'error');
        document.getElementById(containerId).innerHTML = `<p class="error-text">❌ ${error.message}</p>`;
    }
});
