package finbarre.service.serviceForUsers;

import java.util.List;

import finbarre.domain.Cashup;

public class CashupWithOrdersClosed {

	private Cashup cashup;
	private List<OrderClosedWithProducts> ordersClosedWithProducts;
	

	
	public List<OrderClosedWithProducts> getOrdersClosedWithProducts() {
		return ordersClosedWithProducts;
	}
	public void setOrdersClosedWithProducts(List<OrderClosedWithProducts> ordersClosedWithProducts) {
		this.ordersClosedWithProducts = ordersClosedWithProducts;
	}
	public Cashup getCashup() {
		return cashup;
	}
	public void setCashup(Cashup cashup) {
		this.cashup = cashup;
	}
	
	
}
