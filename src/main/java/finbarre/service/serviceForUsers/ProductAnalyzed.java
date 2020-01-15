package finbarre.service.serviceForUsers;

import java.math.BigDecimal;

import finbarre.domain.Product;

public class ProductAnalyzed {

	private Product product;
	private Integer quantity;
	private BigDecimal purchPriceNet;
	private BigDecimal purchPriceGross;
	private BigDecimal purchVatValue;
	private BigDecimal sellPriceNet;
	private BigDecimal sellPriceGross;
	private BigDecimal sellVatValue;
	private Integer previousPeriodQuantity;

	public Integer getPreviousPeriodQuantity() {
		return previousPeriodQuantity;
	}

	public void setPreviousPeriodQuantity(Integer previousPeriodQuantity) {
		this.previousPeriodQuantity = previousPeriodQuantity;
	}

	public Product getProduct() {
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

	public BigDecimal getPurchPriceNet() {
		return purchPriceNet;
	}

	public void setPurchPriceNet(BigDecimal purchPriceNet) {
		this.purchPriceNet = purchPriceNet;
	}

	public BigDecimal getPurchPriceGross() {
		return purchPriceGross;
	}

	public void setPurchPriceGross(BigDecimal purchPriceGross) {
		this.purchPriceGross = purchPriceGross;
	}

	public BigDecimal getPurchVatValue() {
		return purchVatValue;
	}

	public void setPurchVatValue(BigDecimal purchVatValue) {
		this.purchVatValue = purchVatValue;
	}

	public BigDecimal getSellPriceNet() {
		return sellPriceNet;
	}

	public void setSellPriceNet(BigDecimal sellPriceNet) {
		this.sellPriceNet = sellPriceNet;
	}

	public BigDecimal getSellPriceGross() {
		return sellPriceGross;
	}

	public void setSellPriceGross(BigDecimal sellPriceGross) {
		this.sellPriceGross = sellPriceGross;
	}

	public BigDecimal getSellVatValue() {
		return sellVatValue;
	}

	public void setSellVatValue(BigDecimal sellVatValue) {
		this.sellVatValue = sellVatValue;
	}
}
