package finbarre.web.rest.forUsers;

import static java.time.temporal.TemporalAdjusters.firstDayOfMonth;
import static java.time.temporal.TemporalAdjusters.lastDayOfMonth;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import finbarre.domain.Cashup;
import finbarre.domain.Product;
import finbarre.domain.Restaurant;
import finbarre.domain.UserToRestaurant;
import finbarre.repository.CashupRepository;
import finbarre.repository.ProductRepository;
import finbarre.repository.ProductSoldRepository;
import finbarre.repository.UserToRestaurantRepository;
import finbarre.security.SecurityUtils;
import finbarre.service.serviceForUsers.ProductAnalyzed;
import finbarre.service.serviceForUsers.ProductsAnalyzed;
/**
 * REST controller for managing SaleAnalysis.
 */
@RestController
@RequestMapping("/api")
public class SaleAnalysisResource {

	private final Logger log = LoggerFactory.getLogger(SaleAnalysisResource.class);

	@Autowired
	private CashupRepository cashupRepository;


	@Autowired
	private ProductSoldRepository productSoldRepository; 
	
    @Autowired
    private ProductRepository productRepository;

	@Autowired
	private UserToRestaurantRepository userToRestaurantRepository;

	/**
	 * GET /sale-analysis/:id : get the "id" SaleAnalysis.
	 *
	 */
	@GetMapping("/sale-analysis/{id}")
	public synchronized ProductsAnalyzed getProductsForSaleAnalysis(@PathVariable String id) {
		   log.debug("REST request to get ProductsForSaleAnalysis : {}", id);
		   
		   //dwie ostatnie cyfry id to ilość tygodni

			// fu
			final String userStr = SecurityUtils.getCurrentUserLogin().get();
			final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(userStr);
			final Restaurant restaurant = userToRestaurant.getRestaurant();
		   
		   String weeksStr = id.substring(Math.max(id.length() - 2, 0));
		   int weeks =  Integer.parseInt(weeksStr);
		   String cashupIdStr = id.substring(0, Math.max(id.length() - 2, 0));
		   long cashupId = Long.parseLong(cashupIdStr);

			Cashup cashup = cashupRepository.findById(cashupId).get();
			ZonedDateTime initial = cashup.getBarmanLoginTime();
			Timestamp start = null;
			Timestamp end = null;
			Timestamp previousPeriodStart = null;
			Timestamp previousPeriodEnd = null;
			List<Object[]> objectsSoldInPeriod = new ArrayList<>();
			List<ProductAnalyzed> productsSoldInPeriodList = new ArrayList<>();
			ProductsAnalyzed productsAnalyzed= new ProductsAnalyzed();
			Integer previousPeriodQuantity = null;
			
			if (weeks == 0) {
				start = Timestamp.from(initial.with(firstDayOfMonth()).toInstant());
				end = Timestamp.from(initial.with(lastDayOfMonth()).toInstant());
				previousPeriodStart = Timestamp.from(initial.with(firstDayOfMonth()).minusMonths(1).toInstant());
				previousPeriodEnd = Timestamp.from(initial.with(lastDayOfMonth()).minusMonths(1).toInstant());
				objectsSoldInPeriod = productSoldRepository.findProductsByOrderedTimeBetween(start, end,
						previousPeriodStart, previousPeriodEnd, restaurant.getId());
			} else if (weeks == 99){
//				start = Timestamp.from(initial.toInstant());
//				end = Timestamp.from(initial.with(lastDayOfMonth()).toInstant());
//				previousPeriodStart = Timestamp.from(initial.with(firstDayOfMonth()).minusMonths(1).toInstant());
//				previousPeriodEnd = Timestamp.from(initial.with(lastDayOfMonth()).minusMonths(1).toInstant());
				long cashupId2 = cashupId;
				objectsSoldInPeriod = productSoldRepository.findProductsByCashupId(cashupId, cashupId2, restaurant);
				
			} else {
				// trzeba zmienić ZonedDateTime na Timestamp bo zapytani sql nie
				// przechodzi
				ZonedDateTime startZonedDateTime = initial.minusWeeks(weeks);
				start = Timestamp.from(startZonedDateTime.toInstant());
				ZonedDateTime endZonedDateTime = initial.with(lastDayOfMonth());
				end = Timestamp.from(endZonedDateTime.toInstant());
				ZonedDateTime previousPeriodStartZonedDateTime = initial.minusWeeks(weeks * 2);
				previousPeriodStart = Timestamp.from(previousPeriodStartZonedDateTime.toInstant());
				previousPeriodEnd = start;
				log.debug("weeks: "+weeks+" start: "+start+" end: "+end);
				objectsSoldInPeriod = productSoldRepository.findProductsByOrderedTimeBetween(start, end,
						previousPeriodStart, previousPeriodEnd, restaurant.getId());
			}
			for (Object[] psip : objectsSoldInPeriod) {
				ProductAnalyzed productAnalyzed = new ProductAnalyzed();
				BigInteger pid = (BigInteger) psip[0];
				Long productId = pid.longValue();
				Optional<Product> pOpt = productRepository.findById(productId);
				Product p = pOpt.get();
				productAnalyzed.setProduct(p);

				BigDecimal q = (BigDecimal) psip[1];
				Integer quantity = q.intValue();
				productAnalyzed.setQuantity(quantity);

				productAnalyzed.setSellPriceGross((BigDecimal) psip[2]);
				productAnalyzed.setSellPriceNet((BigDecimal) psip[3]);
				productAnalyzed.setSellVatValue((BigDecimal) psip[4]);
				productAnalyzed.setPurchVatValue((BigDecimal) psip[5]);
				productAnalyzed.setPurchPriceNet((BigDecimal) psip[6]);
				productAnalyzed.setPurchPriceGross((BigDecimal) psip[7]);

				if (psip[8] != null) {
					BigDecimal pq = (BigDecimal) psip[8];
					previousPeriodQuantity = pq.intValue();
				} else {
					previousPeriodQuantity = 0;
				}
				productAnalyzed.setPreviousPeriodQuantity(previousPeriodQuantity);
				productsSoldInPeriodList.add(productAnalyzed);
				productsAnalyzed.setProductsAnalyzed(productsSoldInPeriodList);
			}
			
			return productsAnalyzed;
	}

	/**
	 * GET /sale-analysis/:id : get the SaleAnalysis.
	 *
	 */
	@GetMapping("/sale-analysis")
	public synchronized List<ProductAnalyzed> getThisMonthAnalysis() {
		log.debug("REST request to get ThisMonthAnalysis");
		// fu
		final String userStr = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(userStr);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		final ZonedDateTime initial = ZonedDateTime.now(ZoneId.systemDefault());
        // trzeba zmienić ZonedDateTime na Timestamp bo zapytani sql nie przechodzi
		final Timestamp start = Timestamp.from(initial.with(firstDayOfMonth()).toInstant());
		final Timestamp end = Timestamp.from(initial.with(lastDayOfMonth()).toInstant());		
		final Timestamp previousPeriodStart=Timestamp.from(initial.with(firstDayOfMonth()).minusMonths(1).toInstant());
		final Timestamp previousPeriodEnd=Timestamp.from(initial.with(lastDayOfMonth()).minusMonths(1).toInstant());
		List<Object[]> objectsSoldInPeriod = productSoldRepository.findProductsByOrderedTimeBetween(start, end, previousPeriodStart, previousPeriodEnd, restaurant.getId());

		List<ProductAnalyzed> productsSoldInPeriod = getProductsSoldInPeriod(objectsSoldInPeriod);
		return productsSoldInPeriod;
    }
	


	/**
	 * GET /sale-analysis/:id : get the SaleAnalysis.
	 *
	 */
	@GetMapping("/sale-analysis/cashups")
	public synchronized List<Cashup> getCashups() {
		log.debug("REST request to get getCashups");
		// fu
		final String userStr = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(userStr);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		final List<Cashup> cashups = cashupRepository.findAllByRestaurantOrderByBarmanLoginTimeDesc(restaurant);
		return cashups;
    }
    
	/**
	 * GET /sale-analysis/:id : get the SaleAnalysis.
	 *
	 */
	@GetMapping("/sale-analysis/cashups/{id}")
	public synchronized ProductsAnalyzed getProductAnalyzedForSingleDay(@PathVariable Long id) {
		log.debug("REST request to getProductAnalyzedForSingleDay");
		// fu
		final String userStr = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(userStr);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		final List<Object[]> objectsSoldInPeriod = productSoldRepository.findProductsByCashupId(id, id, restaurant);
		final List<ProductAnalyzed> productsSoldInPeriod = getProductsSoldInPeriod(objectsSoldInPeriod);
		final ProductsAnalyzed productsAnalyzed = new ProductsAnalyzed();
		productsAnalyzed.setProductsAnalyzed(productsSoldInPeriod);
		return productsAnalyzed;
		
	}
	
	List<ProductAnalyzed> getProductsSoldInPeriod(List<Object[]> objectsSoldInPeriod){
		List<ProductAnalyzed> productsSoldInPeriod = new ArrayList<>();
		Integer previousPeriodQuantity = null;
		for(Object[] psip: objectsSoldInPeriod) {
			ProductAnalyzed productAnalyzed = new ProductAnalyzed();
			BigInteger pid=(BigInteger) psip[0];
			Long productId=pid.longValue();
			Optional<Product> pOpt = productRepository.findById(productId);
			Product p = pOpt.get();
			productAnalyzed.setProduct(p);
			
			BigDecimal q = (BigDecimal) psip[1];
			Integer quantity = q.intValue();
			productAnalyzed.setQuantity(quantity);
			
			productAnalyzed.setSellPriceGross((BigDecimal) psip[2]);
			productAnalyzed.setSellPriceNet((BigDecimal) psip[3]);
			productAnalyzed.setSellVatValue((BigDecimal) psip[4]);
			productAnalyzed.setPurchVatValue((BigDecimal) psip[5]);
			productAnalyzed.setPurchPriceNet((BigDecimal) psip[6]);
			productAnalyzed.setPurchPriceGross((BigDecimal) psip[7]);


			if (psip[8] != null) {
				BigDecimal pq = (BigDecimal) psip[8];
				previousPeriodQuantity = pq.intValue();
			} else {
				previousPeriodQuantity = 0;
			}
			productAnalyzed.setPreviousPeriodQuantity(previousPeriodQuantity);
			productsSoldInPeriod.add(productAnalyzed);			
		}
		return productsSoldInPeriod;
	}
}
