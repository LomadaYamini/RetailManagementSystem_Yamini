package com.accenture.lkm.web.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.accenture.lkm.bean.OrderBean;
import com.accenture.lkm.service.OrderService;

@RestController
@RequestMapping("/order/controller")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // =====================================================
    // ✅ 1. GET Orders by Customer ID
    // =====================================================
    @GetMapping("/getOrderDetailsByCustomerId/{customerId}")
    public ResponseEntity<List<OrderBean>> getOrderDetailsByCustomerId(
            @PathVariable int customerId) {

        List<OrderBean> orders =
                orderService.getOrderDetailsByCustomerId(customerId);

        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    // =====================================================
    // ✅ 2. GET Orders by Type & Range (FINAL FIXED)
    // =====================================================
    @GetMapping("/getOrderDetailsByCustomerTypeAndBillInRange/{customerType}/{minimum}/{maximum}")
    public ResponseEntity<List<OrderBean>> getOrderDetailsByCustomerTypeAndBillInRange(
            @PathVariable String customerType,
            @PathVariable double minimum,
            @PathVariable double maximum) {

        List<OrderBean> orders =
                orderService.getOrderDetailsByCustomerTypeAndBillInRange(
                        customerType, minimum, maximum);

        return new ResponseEntity<>(orders, HttpStatus.OK);
    }
}
