package finbarre.web.rest.forUsers;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

import javax.persistence.LockModeType;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import finbarre.domain.OrderClosed;
import finbarre.domain.OrderOpened;
import finbarre.domain.ProductOrdered;
import finbarre.domain.ProductSold;
import finbarre.domain.Restaurant;
import finbarre.domain.UserToRestaurant;
import finbarre.repository.CashupRepository;
import finbarre.repository.OrderClosedRepository;
import finbarre.repository.OrderOpenedRepository;
import finbarre.repository.ProductOnStockRepository;
import finbarre.repository.ProductOrderedRepository;
import finbarre.repository.ProductSoldRepository;
import finbarre.repository.UserRepository;
import finbarre.repository.UserToRestaurantRepository;
import finbarre.security.SecurityUtils;
import finbarre.service.serviceForUsers.AdditionalHeaderUtil;
import finbarre.web.rest.ProductOnStockResource;
import io.github.jhipster.web.util.HeaderUtil;

@RestController
@RequestMapping("/api")
public class PayResource {

    private final Logger log = LoggerFactory.getLogger(OrderWithProductsResource.class);

    private final OrderOpenedRepository orderOpenedRepository;

    private static final String ENTITY_NAME = "orderOpened";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;
    
    //fu
    private final UserToRestaurantRepository userToRestaurantRepository;

	private final ProductOnStockRepository productOnStockRepository;

	private final ProductOnStockResource productOnStockResource;

	private final ProductOrderedRepository productOrderedRepository;

    private final UserRepository userRepository;
    
    private final OrderClosedRepository orderClosedRepository;

    private final CashupRepository cashupRepository;
    private final ProductSoldRepository productSoldRepository;

    public PayResource(
    		OrderOpenedRepository orderOpenedRepository, 
    		UserToRestaurantRepository userToRestaurantRepository,
    		ProductOnStockRepository productOnStockRepository,
    		ProductOnStockResource productOnStockResource,
    		ProductOrderedRepository productOrderedRepository,
    		UserRepository userRepository,
    		OrderClosedRepository orderClosedRepository,
    		CashupRepository cashupRepository,
    		ProductSoldRepository productSoldRepository) {
        this.orderOpenedRepository = orderOpenedRepository;
        this.productOnStockRepository = productOnStockRepository;
        this.productOnStockResource = productOnStockResource;
        this.productOrderedRepository = productOrderedRepository;
        this.userRepository = userRepository;
        //fu
        this.userToRestaurantRepository=userToRestaurantRepository;
        this.orderClosedRepository=orderClosedRepository;
        this.cashupRepository=cashupRepository;
        this.productSoldRepository=productSoldRepository;
    }
    
    /**
     * PUT  /order-closeds : Updates an existing orderClosed.
     *
     * @param orderClosed the orderClosed to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated orderClosed,
     * or with status 400 (Bad Request) if the orderClosed is not valid,
     * or with status 500 (Internal Server Error) if the orderClosed couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/pay")
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    public synchronized ResponseEntity<OrderClosed> pay(@RequestBody OrderOpened orderOpened) throws URISyntaxException {
//        OrderOpened orderOpened = orderOpenedRepository.findOne(orderOpened.getId());
        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Restaurant restaurant=userToRestaurant.getRestaurant();
        final List<ProductOrdered> productOrdereds = productOrderedRepository.findAllByRestaurantAndOrderId(restaurant, orderOpened.getId());
    	
    	
        log.debug("REST request to pay : {}", orderOpened);
        final OrderClosed orderClosed= new OrderClosed();
        orderClosed.setBarman(orderOpened.getBarman());
//    	if(orderOpened.getComment()==null){
//    		orderClosed.setComment("#"+orderOpened.getId());
//    	} else {
//    		orderClosed.setComment(orderOpened.getComment()+". #"+orderOpened.getId());
//    	}
    	orderClosed.setComment(orderOpened.getComment());
        orderClosed.setDesk(orderOpened.getDesk());
        orderClosed.setPayment(orderOpened.getPayment());
        orderClosed.setTotal(orderOpened.getTotal());
        orderClosed.setOpeningTime(orderOpened.getOpeningTime());
        orderClosed.setClosingTime(orderOpened.getClosingTime());
        orderClosed.setCashupDay(cashupRepository.findFirstByRestaurantOrderByIdDesc(restaurant));
        orderClosed.setRestaurant(restaurant);
        orderClosed.setOrderId(orderOpened.getOrderId());
        final OrderClosed result = orderClosedRepository.save(orderClosed);

    	
    	for(ProductOrdered po : productOrdereds){
    		final ProductSold productSold = new ProductSold();
    		productSold.setOrder(orderClosed);
    		productSold.setSendTime(po.getSendTime());
    		productSold.setAcceptedTime(po.getAcceptedTime());
    		productSold.setOrderedTime(po.getOrderedTime());
    		productSold.setTakenTime(po.getTakenTime());
    		productSold.setFinishedTime(po.getFinishedTime());
    		productSold.setChef(po.getChef());
    		productSold.setComment(po.getComment());
    		productSold.setDeliveryDate(po.getDeliveryDate());
    		productSold.setDifference(po.getDifference());
    		productSold.setFinishedTime(po.getFinishedTime());
    		productSold.setProduct(po.getProduct());
    		productSold.setPurchPriceNet(po.getPurchPriceNet());
    		productSold.setProductSoldPurchPriceRate(po.getProductOrderedPurchPriceRate());
    		productSold.setPurchVatValue(po.getPurchVatValue());
    		productSold.setPurchPriceGross(po.getPurchPriceGross());
    		productSold.setSellPriceNet(po.getSellPriceNet());
    		productSold.setProductSoldSellPriceRate(po.getProductOrderedSellPriceRate());
    		productSold.setSellVatValue(po.getSellVatValue());
    		productSold.setSellPriceGross(po.getSellPriceGross());
    		productSold.setQuantity(po.getQuantity());
    		productSold.setRestaurant(restaurant);
    		ProductSold productSoldResult = productSoldRepository.save(productSold);

        	productOrderedRepository.deleteById(po.getId());
    	}    	
    	orderOpenedRepository.deleteById(orderOpened.getId());
    	
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                .body(result);
//    	return null;
    }
    

    /**
     * POST  /order-closeds : Create a new orderClosed.
     *
     * @param orderClosed the orderClosed to create
     * @return the ResponseEntity with status 201 (Created) and with body the new orderClosed, or with status 400 (Bad Request) if the orderClosed has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/pay")
    public synchronized ResponseEntity<OrderClosed> createJoinedPayment(@Valid @RequestBody OrderOpened orderOpened) throws URISyntaxException {
        log.debug("REST request to create joined payment : {}", orderOpened);
        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Restaurant restaurant=userToRestaurant.getRestaurant();
        final OrderClosed orderClosed = new OrderClosed();
        orderClosed.setBarman(orderOpened.getBarman());
//    	if(orderOpened.getComment()==null){
//    		orderClosed.setComment("#"+orderOpened.getId());
//    	} else {
//    		orderClosed.setComment(orderOpened.getComment()+". #"+orderOpened.getId());
//    	}
    	orderClosed.setComment(orderOpened.getComment());
        orderClosed.setDesk(orderOpened.getDesk());
        orderClosed.setPayment(orderOpened.getPayment());
        orderClosed.setTotal(orderOpened.getTotal());
        orderClosed.setOpeningTime(orderOpened.getOpeningTime());
        orderClosed.setClosingTime(orderOpened.getClosingTime());
        orderClosed.setCashupDay(cashupRepository.findFirstByRestaurantOrderByIdDesc(restaurant));
        orderClosed.setRestaurant(restaurant);
        orderClosed.setOrderId(orderOpened.getOrderId());
        
        final OrderClosed result = orderClosedRepository.save(orderClosed);
        return ResponseEntity.created(new URI("/api/order-closeds/" + result.getId()))
            .headers(AdditionalHeaderUtil.joinedPaymentCreatedAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }
    
    
}
