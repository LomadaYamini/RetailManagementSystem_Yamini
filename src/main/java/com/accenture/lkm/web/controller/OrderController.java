@RestController
@RequestMapping("/order/controller")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // ✅ Orders by Customer ID
    @GetMapping("/getOrderDetailsByCustomerId/{customerId}")
    public ResponseEntity<List<OrderBean>> getOrderDetailsByCustomerId(
            @PathVariable int customerId) {

        return new ResponseEntity<>(
                orderService.getOrderDetailsByCustomerId(customerId),
                HttpStatus.OK
        );
    }

    // ✅ FIXED RANGE API (FINAL)
    @GetMapping("/getOrderDetailsByCustomerTypeAndBillInRange/{type}/{min}/{max}")
    public ResponseEntity<List<OrderBean>> getOrdersByRange(
            @PathVariable("type") String type,
            @PathVariable("min") double min,
            @PathVariable("max") double max) {

        return new ResponseEntity<>(
                orderService.getOrderDetailsByCustomerTypeAndBillInRange(type, min, max),
                HttpStatus.OK
        );
    }
}
