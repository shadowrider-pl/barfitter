package finbarre.service.serviceForUsers;

import java.util.List;

public class ProductsOfCategoryWithOrderedQuantity {
	private List<ProductOnStockWithOrderedQuantity> productsOfCategory;

	public List<ProductOnStockWithOrderedQuantity> getProductsOfCategory() {
		return productsOfCategory;
	}

	public void setProductsOfCategory(List<ProductOnStockWithOrderedQuantity> productsOfCategory) {
		this.productsOfCategory = productsOfCategory;
	}

}
