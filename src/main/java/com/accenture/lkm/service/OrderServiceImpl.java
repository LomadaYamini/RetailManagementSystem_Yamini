package com.accenture.lkm.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.accenture.lkm.bean.OrderBean;
import com.accenture.lkm.dao.OrderDAOWrapper;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderDAOWrapper orderDAOWrapper;

    @Override
    public List<OrderBean> getOrderDetailsByCustomerId(int customerId) {
        return orderDAOWrapper.getOrderDetailsByCustomerId(customerId);
    }

    @Override
    public List<OrderBean> getOrderDetailsByCustomerTypeAndBillInRange(
            String customerType, double minimum, double maximum) {
        return orderDAOWrapper.getOrderDetailsByCustomerTypeAndBillInRange(
            customerType, minimum, maximum
        );
    }
}