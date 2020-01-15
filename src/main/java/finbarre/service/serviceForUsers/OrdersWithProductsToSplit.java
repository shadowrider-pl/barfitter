package finbarre.service.serviceForUsers;

public class OrdersWithProductsToSplit {
	OrderWithProducts oldOrder;
	OrderWithProducts newOrder;
	public OrderWithProducts getOldOrder() {
		return oldOrder;
	}
	public void setOldOrder(OrderWithProducts oldOrder) {
		this.oldOrder = oldOrder;
	}
	public OrderWithProducts getNewOrder() {
		return newOrder;
	}
	public void setNewOrder(OrderWithProducts newOrder) {
		this.newOrder = newOrder;
	}
}
