package com.accenture.lkm.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.accenture.lkm.entity.ProductEntity;

public interface ProductDAO extends JpaRepository<ProductEntity, Integer> {

    @Modifying
    @Transactional
    @Query("UPDATE ProductEntity p SET p.stock = :stock WHERE p.productId = :productId")
    int updateProductStock(
        @Param("stock") int stock,
        @Param("productId") int productId
    );
}