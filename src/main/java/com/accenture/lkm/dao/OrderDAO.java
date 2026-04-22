package com.accenture.lkm.dao;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.accenture.lkm.entity.OrderEntity;

public interface OrderDAO extends JpaRepository<OrderEntity, Integer> {

    @Query("SELECT o FROM OrderEntity o WHERE o.customerId = :customerId")
    List<OrderEntity> findByCustomerId(
        @Param("customerId") int customerId
    );

    @Query("SELECT o FROM OrderEntity o WHERE o.billingAmount >= :minimum AND o.billingAmount <= :maximum")
    List<OrderEntity> orderDetailsWithinRange(
        @Param("minimum") double minimum,
        @Param("maximum") double maximum
    );
}