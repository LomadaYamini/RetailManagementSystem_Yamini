package com.accenture.lkm.service;

import java.util.List;

import com.accenture.lkm.bean.OrderBean;

public interface OrderService {

    List<OrderBean> getOrderDetailsByCustomerId(int customerId);

    List<OrderBean> getOrderDetailsByCustomerTypeAndBillInRange(
        String customerType, double minimum, double maximum
    );
}