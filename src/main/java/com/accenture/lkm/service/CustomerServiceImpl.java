package com.accenture.lkm.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.accenture.lkm.bean.CustomerBean;
import com.accenture.lkm.dao.CustomerDAOWrapper;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerDAOWrapper customerDAOWrapper;

    @Override
    public CustomerBean updateCustomerType(CustomerBean customerBean) {
        return customerDAOWrapper.updateCustomerType(customerBean);
    }

    @Override
    public List<CustomerBean> getCustomerDetailsByType(String customerType) {
        return customerDAOWrapper.getCustomerDetailsByType(customerType);
    }
}