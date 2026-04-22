package com.accenture.lkm.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.accenture.lkm.entity.CustomerEntity;

public interface CustomerDAO extends JpaRepository<CustomerEntity, Integer> {

    @Query("SELECT c FROM CustomerEntity c WHERE c.customerType = :customerType")
    List<CustomerEntity> getCustomerDetailsByType(
        @Param("customerType") String customerType
    );

    CustomerEntity findByCustomerEmail(String customerEmail);
}