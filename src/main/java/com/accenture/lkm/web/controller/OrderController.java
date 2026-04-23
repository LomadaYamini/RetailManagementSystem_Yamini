// OLD FORMAT SUPPORT (--)

@GetMapping("/getOrderDetailsByCustomerTypeAndBillInRange/{customerType}--{minimum}--{maximum}")
public ResponseEntity<List<OrderBean>> getOrdersOld(
        @PathVariable String customerType,
        @PathVariable double minimum,
        @PathVariable double maximum) {

    List<OrderBean> orders =
            orderService.getOrderDetailsByCustomerTypeAndBillInRange(
                    customerType, minimum, maximum);

    return new ResponseEntity<>(orders, HttpStatus.OK);
}


// NEW FORMAT SUPPORT (/)

@GetMapping("/getOrderDetailsByCustomerTypeAndBillInRange/{customerType}/{minimum}/{maximum}")
public ResponseEntity<List<OrderBean>> getOrdersNew(
        @PathVariable String customerType,
        @PathVariable double minimum,
        @PathVariable double maximum) {

    List<OrderBean> orders =
            orderService.getOrderDetailsByCustomerTypeAndBillInRange(
                    customerType, minimum, maximum);

    return new ResponseEntity<>(orders, HttpStatus.OK);
}
