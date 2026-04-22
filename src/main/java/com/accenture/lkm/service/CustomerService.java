package com.accenture.lkm.service;

import java.util.List;

import com.accenture.lkm.bean.CustomerBean;

public interface CustomerService {

    CustomerBean updateCustomerType(CustomerBean customerBean);

    List<CustomerBean> getCustomerDetailsByType(String customerType);
}