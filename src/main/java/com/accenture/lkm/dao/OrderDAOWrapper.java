package com.accenture.lkm.dao;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.accenture.lkm.bean.OrderBean;
import com.accenture.lkm.entity.CustomerEntity;
import com.accenture.lkm.entity.OrderEntity;
import com.accenture.lkm.entity.ProductEntity;

@Component
public class OrderDAOWrapper {

    @Autowired
    private OrderDAO orderDAO;

    @Autowired
    private CustomerDAO customerDAO;

    @Autowired
    private ProductDAO productDAO;

    public List<OrderBean> getOrderDetailsByCustomerId(int customerId) {

        CustomerEntity customer = customerDAO
            .findById(customerId)
            .orElse(null);

        if (customer == null) {
            return null;
        }

        List<OrderEntity> orderEntities = 
            orderDAO.findByCustomerId(customerId);

        if (orderEntities == null || orderEntities.isEmpty()) {
            return null;
        }

        List<OrderBean> orderBeans = new ArrayList<>();
        for (OrderEntity entity : orderEntities) {
            orderBeans.add(convertOrderEntityToBean(entity));
        }

        return orderBeans;
    }

    public List<OrderBean> getOrderDetailsByCustomerTypeAndBillInRange(
            String customerType, double minimum, double maximum) {

        List<OrderEntity> orderEntities = 
            orderDAO.orderDetailsWithinRange(minimum, maximum);

        if (orderEntities == null || orderEntities.isEmpty()) {
            return null;
        }

        List<OrderBean> filteredOrders = new ArrayList<>();

        for (OrderEntity entity : orderEntities) {
            CustomerEntity customer = customerDAO
                .findById(entity.getCustomerId())
                .orElse(null);

            if (customer != null && 
                customer.getCustomerType().equals(customerType)) {
                filteredOrders.add(convertOrderEntityToBean(entity));
            }
        }

        if (filteredOrders.isEmpty()) {
            return null;
        }

        return filteredOrders;
    }

    public OrderBean convertOrderEntityToBean(OrderEntity entity) {
        OrderBean bean = new OrderBean();
        bean.setOrderId(entity.getOrderId());
        bean.setCustomerId(entity.getCustomerId());
        bean.setProductId(entity.getProductId());
        bean.setQuantity(entity.getQuantity());
        bean.setBillingAmount(entity.getBillingAmount());
        bean.setOrderDate(entity.getOrderDate().toString());

        CustomerEntity customer = customerDAO
            .findById(entity.getCustomerId())
            .orElse(null);
        if (customer != null) {
            bean.setCustomerEmail(customer.getCustomerEmail());
        }

        ProductEntity product = productDAO
            .findById(entity.getProductId())
            .orElse(null);
        if (product != null) {
            bean.setProductName(product.getProductName());
        }

        return bean;
    }
}