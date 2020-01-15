package finbarre.repository;

import finbarre.domain.OrderClosed;
import java.sql.Timestamp;
import java.time.ZonedDateTime;
import finbarre.domain.Product;
import finbarre.domain.ProductSold;
import finbarre.domain.Restaurant;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the ProductSold entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductSoldRepository extends JpaRepository<ProductSold, Long> {

    @Query("select product_sold from ProductSold product_sold where product_sold.chef.login = ?#{principal.username}")
    List<ProductSold> findByChefIsCurrentUser();

	List<ProductSold> findAllByProductIdAndRestaurant(long l, Restaurant restaurant);

	List<ProductSold> findAllByRestaurantAndOrderOrderByOrderedTime(Restaurant restaurant, OrderClosed oc);

	ProductSold findOneByProduct(Product product);


	// SELECT `product_id` , SUM( `quantity` ) AS quantity,
	// SUM( `sell_price_gross` * `quantity`) AS sell_price_gross,
	// sum(`sell_price_net` * `quantity`) AS sell_price_net,
	// sum(`sell_vat_value` * `quantity`) AS sell_vat_value,
	// sum(`purch_vat_value` * `quantity`) AS purch_vat_value,
	// sum(`purch_price_net` * `quantity`) AS purch_price_net,
	// sum(`purch_price_gross` * `quantity`) AS purch_price_gross
	// FROM `product_sold`
	// WHERE `ordered_time`
	// BETWEEN '2017-09-01'
	// AND '2017-09-30'
	// GROUP BY product_id
	// ORDER BY quantity DESC

	// SELECT `product_id` AS product, SUM( `quantity` ) AS quantity,
	// SUM( `sell_price_gross` * `quantity`) AS sell_price_gross,
	// sum(`sell_price_net` * `quantity`) AS sell_price_net,
	// sum(`sell_vat_value` * `quantity`) AS sell_vat_value,
	// sum(`purch_vat_value` * `quantity`) AS purch_vat_value,
	// sum(`purch_price_net` * `quantity`) AS purch_price_net,
	// sum(`purch_price_gross` * `quantity`) AS purch_price_gross,
	// (select SUM( `quantity` ) FROM `product_sold`Where product_id=product
	// And `ordered_time`
	// BETWEEN '2017-06-01'
	// AND '2017-06-30') previous_period_quantity
	// FROM `product_sold`
	// WHERE `ordered_time`
	// BETWEEN '2017-09-01'
	// AND '2017-09-30'
	// GROUP BY product_id
	// ORDER BY quantity DESC
	@Query(nativeQuery = true, value = "select product_id AS product, " + "SUM( quantity ) AS quantity, "
			+ "SUM( sell_price_gross * quantity) AS sell_price_gross, "
			+ "sum(sell_price_net * quantity) AS sell_price_net, "
			+ "sum(sell_vat_value * quantity) AS sell_vat_value, "
			+ "sum(purch_vat_value * quantity) AS purch_vat_value, "
			+ "sum(purch_price_net * quantity) AS purch_price_net, "
			+ "sum(purch_price_gross * quantity) AS purch_price_gross,  " + "(" + "SELECT SUM( quantity ) "
			+ "FROM  product_sold " + "WHERE product_id = product " 
			+ "AND restaurant_id=?5 "
			+ "AND ordered_time " + "BETWEEN  ?3 " + "AND ?4 "
			+ ") previous_period_quantity " + "from product_sold " + "WHERE ordered_time BETWEEN ?1 and ?2 "
			+ "GROUP BY product_id " + "ORDER BY quantity DESC")
	List<Object[]> findProductsByOrderedTimeBetween(Timestamp start, Timestamp end, Timestamp previousPeriodStart,
			Timestamp previousPeriodEnd, Long id);

	// SELECT `product_id` AS product, SUM( `quantity` ) AS quantity,
	// SUM( `sell_price_gross` * `quantity`) AS sell_price_gross,
	// sum(`sell_price_net` * `quantity`) AS sell_price_net,
	// sum(`sell_vat_value` * `quantity`) AS sell_vat_value,
	// sum(`purch_vat_value` * `quantity`) AS purch_vat_value,
	// sum(`purch_price_net` * `quantity`) AS purch_price_net,
	// sum(`purch_price_gross` * `quantity`) AS purch_price_gross,
	//
	// (select SUM( `quantity` ) FROM `product_sold` ps1 Where
	// ps1.product_id=product
	// And ps1.order_id in (select id from order_closed oc1 where
	// oc1.cashup_day_id=(23))) previous_period_quantity
	//
	// FROM `product_sold`ps
	// WHERE ps.order_id in (select id from order_closed oc where
	// oc.cashup_day_id=24)
	//
	// GROUP BY product_id
	// ORDER BY quantity DESC
	@Query(nativeQuery = true, value = "SELECT `product_id` AS product, "
			+ "SUM( `quantity` ) AS quantity, "
			+ "SUM( `sell_price_gross` * `quantity`) AS sell_price_gross, "
			+ "sum(`sell_price_net` * `quantity`) AS sell_price_net, "
			+ "sum(`sell_vat_value` * `quantity`) AS sell_vat_value, "
			+ "sum(`purch_vat_value` * `quantity`) AS purch_vat_value, "
			+ "sum(`purch_price_net` * `quantity`) AS purch_price_net, "
			+ "sum(`purch_price_gross` * `quantity`) AS purch_price_gross, "
			+ "(select SUM( `quantity` ) FROM `product_sold` ps1 "
			+ "Where ps1.product_id=product "
			+ "AND ps1.restaurant_id=?3 "
			+ "And ps1.order_id in "
			+ "(select id from order_closed oc1 where oc1.cashup_day_id=(?1-1))) previous_period_quantity "
			+ "FROM `product_sold`ps "
			+ "WHERE ps.order_id in (select id from order_closed oc where oc.cashup_day_id=?2) "
			+ "GROUP BY product_id ORDER BY quantity DESC")
	List<Object[]> findProductsByCashupId(long cashupId1, long cashupId2, Restaurant restaurant);

	List<ProductSold> findAllByOrderOrderByOrderedTime(OrderClosed oc);

	ProductSold findFirstByProductId(Long id);

	List<ProductSold> findAllByRestaurant(Restaurant restaurant);


}
