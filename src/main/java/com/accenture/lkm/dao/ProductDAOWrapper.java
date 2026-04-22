package com.accenture.lkm.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.accenture.lkm.bean.ProductBean;
import com.accenture.lkm.entity.ProductEntity;

@Component
public class ProductDAOWrapper {

    @Autowired
    private ProductDAO productDAO;

    public Integer updateProductStock(ProductBean productBean) {

        ProductEntity existingEntity = productDAO
            .findById(productBean.getProductId())
            .orElse(null);

        if (existingEntity == null) {
            return null;
        }

        return productDAO.updateProductStock(
            productBean.getStock(),
            productBean.getProductId()
        );
    }

    public ProductBean convertProductEntityToBean(ProductEntity entity) {
        ProductBean bean = new ProductBean();
        bean.setProductId(entity.getProductId());
        bean.setProductName(entity.getProductName());
        bean.setPrice(entity.getPrice());
        bean.setStock(entity.getStock());
        return bean;
    }
}