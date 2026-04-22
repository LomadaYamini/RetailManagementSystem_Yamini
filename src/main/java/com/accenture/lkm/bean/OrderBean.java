package com.accenture.lkm.bean;

public class OrderBean {

    private int orderId;
    private int customerId;
    private int productId;
    private String orderDate;
    private int quantity;
    private double billingAmount;
    
    private String customerEmail;
    private String productName;

    public OrderBean() {}

    public int getOrderId() { return orderId; }
    public void setOrderId(int orderId) { this.orderId = orderId; }

    public int getCustomerId() { return customerId; }
    public void setCustomerId(int customerId) { this.customerId = customerId; }

    public int getProductId() { return productId; }
    public void setProductId(int productId) { this.productId = productId; }

    public String getOrderDate() { return orderDate; }
    public void setOrderDate(String orderDate) { this.orderDate = orderDate; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public double getBillingAmount() { return billingAmount; }
    public void setBillingAmount(double billingAmount) { 
        this.billingAmount = billingAmount; 
    }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { 
        this.customerEmail = customerEmail; 
    }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { 
        this.productName = productName; 
    }
}