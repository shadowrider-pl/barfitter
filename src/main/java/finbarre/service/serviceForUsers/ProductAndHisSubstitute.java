package finbarre.service.serviceForUsers;

import finbarre.domain.ProductOnStock;
import finbarre.domain.ProductSold;

public class ProductAndHisSubstitute {
	private static final long serialVersionUID = 1L;

	private ProductOnStock productOnStock;
	private ProductSold substitute;

	
	public ProductAndHisSubstitute(){
		
	}
	
	public ProductOnStock getProductOnStock() {
		return productOnStock;
	}
	public void setProductOnStock(ProductOnStock productOnStock) {
		this.productOnStock = productOnStock;
	}
	public ProductSold getSubstitute() {
		return substitute;
	}
	public void setSubstitute(ProductSold substitute) {
		this.substitute = substitute;
	}
}
