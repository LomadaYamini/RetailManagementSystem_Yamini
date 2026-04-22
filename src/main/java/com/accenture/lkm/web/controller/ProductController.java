package com.accenture.lkm.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.accenture.lkm.bean.ProductBean;
import com.accenture.lkm.service.ProductService;

@RestController
@RequestMapping("/product/controller")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PutMapping("/updateProductStock")
    public ResponseEntity<String> updateProductStock(
            @RequestBody ProductBean productBean) {

        Integer result = productService.updateProductStock(productBean);

        if (result == null) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>("Stock updated successfully", HttpStatus.OK);
    }
}