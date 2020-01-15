package finbarre.service.serviceForUsers;

import java.util.ArrayList;
import java.util.List;

import finbarre.domain.OrderClosed;
import finbarre.domain.ProductSold;

public class OrderClosedWithProducts extends OrderClosed{
	
	private List<ProductSold> productsSold = new ArrayList<>();

	public OrderClosedWithProducts(OrderClosed orig) {
        super();
    }

	public List<ProductSold> getProductsSold() {
		return productsSold;
	}

	public void setProductsSold(List<ProductSold> productsSold) {
		this.productsSold = productsSold;
	}
	
	
}
