package finbarre.web.rest.forUsers;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import finbarre.domain.OrderClosed;
import finbarre.domain.Product;
import finbarre.domain.ProductOnStock;
import finbarre.domain.ProductOrdered;
import finbarre.domain.ProductSold;
import finbarre.domain.Restaurant;
import finbarre.domain.User;
import finbarre.domain.UserToRestaurant;
import finbarre.repository.CashupRepository;
import finbarre.repository.OrderClosedRepository;
import finbarre.repository.OrderOpenedRepository;
import finbarre.repository.ProductOnStockRepository;
import finbarre.repository.ProductSoldRepository;
import finbarre.repository.UserRepository;
import finbarre.repository.UserToRestaurantRepository;
import finbarre.security.SecurityUtils;
import finbarre.service.serviceForUsers.OrderWithProducts;
import finbarre.web.rest.ProductOnStockResource;
import io.github.jhipster.web.util.HeaderUtil;

@RestController
@RequestMapping("/api")
public class FastOrderResource {

	private final Logger log = LoggerFactory.getLogger(DeliveryResourceFU.class);

	@Autowired
	private OrderOpenedRepository orderOpenedRepository;

	@Autowired
	private UserToRestaurantRepository userToRestaurantRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private CashupRepository cashupRepository;

	@Autowired
	private OrderClosedRepository orderClosedRepository;

	@Autowired
	private ProductOnStockRepository productOnStockRepository;

	@Autowired
	private ProductOnStockResource productOnStockResource;

	@Autowired
	private ProductSoldRepository productSoldRepository;

	private static final String ENTITY_NAME = "orderClosed";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

	/**
	 * POST /order-openeds : Create a new FastOrder.
	 *
	 * @param orderOpened
	 *            the orderOpened to create
	 * @return the ResponseEntity with status 201 (Created) and with body the
	 *         new orderOpened, or with status 400 (Bad Request) if the
	 *         orderOpened has already an ID
	 * @throws URISyntaxException
	 *             if the Location URI syntax is incorrect
	 */

	@PostMapping("/fast-order")
	public synchronized ResponseEntity<OrderClosed> createFastOrder(@RequestBody OrderWithProducts orderWithProducts)
			throws URISyntaxException {
		// fu
		final String userStr = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(userStr);
		final User user = userRepository.findOneByLogin(getCurrentUserLogin()).get();
		final Restaurant restaurant = userToRestaurant.getRestaurant();

		OrderClosed orderClosed = new OrderClosed();
		Long lastOrderOpenedId = 0L;
		Long lastOrderClosedId = 0L;
		if (orderOpenedRepository.findFirstByRestaurantOrderByOrderIdDesc(restaurant) != null) {
			lastOrderOpenedId = orderOpenedRepository.findFirstByRestaurantOrderByOrderIdDesc(restaurant).getOrderId();
		}
		if (orderClosedRepository.findFirstByRestaurantOrderByOrderIdDesc(restaurant) != null) {
			lastOrderClosedId = orderClosedRepository.findFirstByRestaurantOrderByOrderIdDesc(restaurant).getOrderId();
		}
		if (lastOrderOpenedId > lastOrderClosedId) {
			orderClosed.setOrderId(lastOrderOpenedId + 1);
		} else {
			orderClosed.setOrderId(lastOrderClosedId + 1);
		}
		orderClosed.setBarman(user);
		orderClosed.setClosingTime(ZonedDateTime.now(ZoneId.systemDefault()));
		if (orderWithProducts.getOpeningTime() != null) {
			orderClosed.setOpeningTime(orderWithProducts.getOpeningTime());
		} else {
			orderClosed.setOpeningTime(ZonedDateTime.now(ZoneId.systemDefault()));
		}
		orderClosed.setComment(orderWithProducts.getComment());
		// orderClosed.setDesk(bar);
		orderClosed.setTotal(orderWithProducts.getTotal());
		orderClosed.setPayment(orderWithProducts.getPayment());
		orderClosed.setCashupDay(cashupRepository.findFirstByRestaurantOrderByIdDesc(restaurant));
		orderClosed.setRestaurant(restaurant);

		OrderClosed orderClosedresult = orderClosedRepository.save(orderClosed);

		List<ProductOrdered> productsOrdered = orderWithProducts.getProductsToOrder();

		if (productsOrdered != null) {
			for (ProductOrdered po : productsOrdered) {

				Product product = po.getProduct();

				List<ProductOnStock> productOnStockList = productOnStockRepository
						.findAllByRestaurantAndProductOrderByDeliveryDate(restaurant, product);
				List<ProductSold> productSoldList = new ArrayList<>();
				int orderedQuantity = po.getQuantity();
				int countQuantity = 0;

				for (ProductOnStock pfs : productOnStockList) {
					ProductSold ps = new ProductSold();
					ps.setOrder(orderClosedresult);
					ps.setProduct(po.getProduct());
					ps.setDeliveryDate(pfs.getDeliveryDate());
					if (!((pfs.getSellPriceGross()).subtract(po.getSellPriceGross()).compareTo(BigDecimal.ZERO) == 0)) {
						ps.setDifference((po.getSellPriceGross()).subtract(pfs.getSellPriceGross()));
					}
					ps.setOrderedTime(ZonedDateTime.now(ZoneId.systemDefault()));
					ps.setProductSoldPurchPriceRate(pfs.getProduct().getProductPurchPriceRate());
					ps.setPurchPriceNet(pfs.getProduct().getPurchPriceNet());
//			log.debug("ps.getPurchPriceNet()="+ps.getPurchPriceNet()+" pfs.getProduct()="+pfs.getProduct().getName()+" pfs.getProduct().getPurchPriceNet()="+pfs.getProduct().getPurchPriceNet());
					ps.setPurchVatValue(pfs.getPurchVatValue());
					ps.setPurchPriceGross(pfs.getPurchPriceGross());
					ps.setProductSoldSellPriceRate(pfs.getProduct().getProductSellPriceRate());
					ps.setSellPriceGross(po.getSellPriceGross());
					ps.setComment(po.getComment());
					ps.setRestaurant(restaurant);
					


					final BigDecimal net = ps.getPurchPriceNet();
					if (net != null && ps.getProductSoldPurchPriceRate() != null) {
						final BigDecimal vat = ps.getProductSoldPurchPriceRate().getRate();
						final BigDecimal gross = net.multiply(vat.add(new BigDecimal(1))).setScale(2, RoundingMode.HALF_UP);
						final BigDecimal vatValue = gross.subtract(net);
						ps.setPurchPriceGross(gross);
						ps.setPurchVatValue(vatValue);
					}
					
					final BigDecimal gross=ps.getSellPriceGross();
			    	if(gross!=null && 
			    			ps.getProductSoldPurchPriceRate()!=null){
			    		final BigDecimal vat = ps.getProductSoldPurchPriceRate().getRate();
			    		final BigDecimal net1=gross.divide(vat.add(new BigDecimal(1)), 2, RoundingMode.HALF_UP);
			    		final BigDecimal vatValue=gross.subtract(net1);
					ps.setSellPriceNet(net1);
					ps.setSellVatValue(vatValue);
			    	}
			    	

					if (pfs.getQuantity() != null && (orderedQuantity - countQuantity) >= pfs.getQuantity()) {
						if (pfs.getProduct().getProductType().getId() == 1) {
							countQuantity = countQuantity + pfs.getQuantity();
							ps.setQuantity(pfs.getQuantity());
							productOnStockResource.deleteProductOnStock(pfs.getId());
						} else {
							countQuantity = orderedQuantity;
							ps.setQuantity(orderedQuantity);
						}
					} else {
						ps.setQuantity(orderedQuantity - countQuantity);
						if (pfs.getProduct().getProductType().getId() == 1) {
							pfs.setQuantity(pfs.getQuantity() - (orderedQuantity - countQuantity));
							productOnStockResource.updateProductOnStock(pfs);
						}
						countQuantity = countQuantity + ps.getQuantity();
					}

					productSoldList.add(ps);

					if (orderedQuantity == countQuantity) {
						break;
					}
				}

				for (ProductSold productAdded : productSoldList) {

					ProductSold productSoldresult = productSoldRepository.save(productAdded);
				}

			}
		}

		// return ResponseEntity.created(new URI("/api/order-closeds/" +
		// orderClosedresult.getId()))
		// .headers(HeaderUtil.createEntityCreationAlert("orderClosed",
		// orderClosedresult.getId().toString()))
		// .body(orderClosedresult);

		final OrderClosed result = orderClosedRepository.save(orderClosed);
		return ResponseEntity.created(new URI("/api/order-closeds/" + result.getId()))
	            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
	            .body(result);

	}

	private String getCurrentUserLogin() {
		org.springframework.security.core.context.SecurityContext securityContext = SecurityContextHolder.getContext();
		Authentication authentication = securityContext.getAuthentication();
		String login = null;
		if (authentication != null)
			if (authentication.getPrincipal() instanceof UserDetails)
				login = ((UserDetails) authentication.getPrincipal()).getUsername();
			else if (authentication.getPrincipal() instanceof String)
				login = (String) authentication.getPrincipal();

		return login;

	}
}
