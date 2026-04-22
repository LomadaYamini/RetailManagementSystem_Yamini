package com.accenture.lkm.dao;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.accenture.lkm.bean.CustomerBean;
import com.accenture.lkm.entity.CustomerEntity;

@Component
public class CustomerDAOWrapper {

    @Autowired
    private CustomerDAO customerDAO;

    public CustomerBean updateCustomerType(CustomerBean customerBean) {

        CustomerEntity existingEntity = customerDAO
            .findById(customerBean.getCustomerId())
            .orElse(null);  

        if (existingEntity == null) {
            return null;
        }

        existingEntity.setCustomerType(customerBean.getCustomerType());

        CustomerEntity savedEntity = customerDAO.save(existingEntity);

        return convertCustomerEntityToBean(savedEntity);
    }

    public List<CustomerBean> getCustomerDetailsByType(String customerType) {

        List<CustomerEntity> entityList = 
            customerDAO.getCustomerDetailsByType(customerType);

        if (entityList == null || entityList.isEmpty()) {
            return null;
        }

        List<CustomerBean> beanList = new ArrayList<>();
        for (CustomerEntity entity : entityList) {
            beanList.add(convertCustomerEntityToBean(entity));
        }

        return beanList;
    }

    public CustomerBean convertCustomerEntityToBean(CustomerEntity entity) {
        CustomerBean bean = new CustomerBean();
        bean.setCustomerId(entity.getCustomerId());
        bean.setCustomerName(entity.getCustomerName());
        bean.setCustomerEmail(entity.getCustomerEmail());
        bean.setCustomerType(entity.getCustomerType());
        return bean;
    }
}