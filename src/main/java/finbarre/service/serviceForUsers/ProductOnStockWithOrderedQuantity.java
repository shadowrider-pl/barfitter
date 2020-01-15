package finbarre.service.serviceForUsers;

import finbarre.domain.ProductOnStock;

public class ProductOnStockWithOrderedQuantity  extends ProductOnStock{
	private static final long serialVersionUID = 1L;
	
	private int orderedQuantity;

	public int getOrderedQuantity() {
		return orderedQuantity;
	}

	public void setOrderedQuantity(int orderedQuantity) {
		this.orderedQuantity = orderedQuantity;
	}
}
