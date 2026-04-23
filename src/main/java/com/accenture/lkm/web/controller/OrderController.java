package com.accenture.lkm.web.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.accenture.lkm.bean.OrderBean;
import com.accenture.lkm.service.OrderService;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/order/controller")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping("/getOrderDetailsByCustomerId/{customerId}")
    public ResponseEntity<List<OrderBean>> getOrderDetailsByCustomerId(
            @PathVariable int customerId) {

        List<OrderBean> orders = 
            orderService.getOrderDetailsByCustomerId(customerId);

        if (orders == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/getOrderDetailsByCustomerTypeAndBillInRange/{customerType}--{minimum}--{maximum}")
    public ResponseEntity<List<OrderBean>> getOrderDetailsByCustomerTypeAndBillInRange(
            @PathVariable String customerType,
            @PathVariable double minimum,
            @PathVariable double maximum) {

        List<OrderBean> orders = 
            orderService.getOrderDetailsByCustomerTypeAndBillInRange(
                customerType, minimum, maximum
            );

        if (orders == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(orders, HttpStatus.OK);
    }
}
