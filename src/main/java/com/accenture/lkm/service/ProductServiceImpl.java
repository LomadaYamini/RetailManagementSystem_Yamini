package com.accenture.lkm.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.accenture.lkm.bean.ProductBean;
import com.accenture.lkm.dao.ProductDAOWrapper;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductDAOWrapper productDAOWrapper;

    @Override
    public Integer updateProductStock(ProductBean productBean) {
        return productDAOWrapper.updateProductStock(productBean);
    }
}