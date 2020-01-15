package finbarre.service.serviceForUsers;

import finbarre.domain.OrderOpened;
import finbarre.domain.ProductOrdered;

import java.util.ArrayList;
import java.util.List;

public class OrderWithProducts extends OrderOpened{
	private static final long serialVersionUID = 1L;
	
	private List<ProductOrdered> productsToOrder = new ArrayList<>();

	public OrderWithProducts(OrderOpened orig) {
        super();
    }
	
	//Introducing the dummy constructor for OrderWithProducts
	public OrderWithProducts() {
     
    }
	
	public void setProductsToOrder(List<ProductOrdered> productsToOrder) {
		this.productsToOrder = productsToOrder;
	}

    public List<ProductOrdered> getProductsToOrder() {
		return productsToOrder;
	}
}
