package com.accenture.lkm.web.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.accenture.lkm.bean.OrderBean;
import com.accenture.lkm.service.OrderService;

@RestController
@RequestMapping("/order/controller")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // ==========================================
    // ✅ 1. Orders by Customer ID
    // ==========================================
    @GetMapping("/getOrderDetailsByCustomerId/{customerId}")
    public List<OrderBean> getOrderDetailsByCustomerId(@PathVariable int customerId) {
        return orderService.getOrderDetailsByCustomerId(customerId);
    }

    // ==========================================
    // ✅ 2. Orders by Type + Range (FINAL FIX)
    // ==========================================
    @GetMapping("/getOrderDetailsByCustomerTypeAndBillInRange/{type}/{min}/{max}")
    public List<OrderBean> getOrdersByRange(
            @PathVariable String type,
            @PathVariable double min,
            @PathVariable double max) {

        return orderService.getOrderDetailsByCustomerTypeAndBillInRange(type, min, max);
    }
}
