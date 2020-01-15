package finbarre.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * A ProductOnStock.
 */
@Entity
@Table(name = "product_on_stock")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class ProductOnStock implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "delivery_date")
    private LocalDate deliveryDate;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "purch_price_net", precision = 21, scale = 2)
    private BigDecimal purchPriceNet;

    @Column(name = "purch_price_gross", precision = 21, scale = 2)
    private BigDecimal purchPriceGross;

    @Column(name = "purch_vat_value", precision = 21, scale = 2)
    private BigDecimal purchVatValue;

    @Column(name = "sell_price_net", precision = 21, scale = 2)
    private BigDecimal sellPriceNet;

    @NotNull
    @Column(name = "sell_price_gross", precision = 21, scale = 2, nullable = false)
    private BigDecimal sellPriceGross;

    @Column(name = "sell_vat_value", precision = 21, scale = 2)
    private BigDecimal sellVatValue;

    @ManyToOne
    @JsonIgnoreProperties("productOnStocks")
    private Product product;

    @ManyToOne
    @JsonIgnoreProperties("productOnStocks")
    private Restaurant restaurant;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDeliveryDate() {
        return deliveryDate;
    }

    public ProductOnStock deliveryDate(LocalDate deliveryDate) {
        this.deliveryDate = deliveryDate;
        return this;
    }

    public void setDeliveryDate(LocalDate deliveryDate) {
        this.deliveryDate = deliveryDate;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public ProductOnStock quantity(Integer quantity) {
        this.quantity = quantity;
        return this;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPurchPriceNet() {
        return purchPriceNet;
    }

    public ProductOnStock purchPriceNet(BigDecimal purchPriceNet) {
        this.purchPriceNet = purchPriceNet;
        return this;
    }

    public void setPurchPriceNet(BigDecimal purchPriceNet) {
        this.purchPriceNet = purchPriceNet;
    }

    public BigDecimal getPurchPriceGross() {
        return purchPriceGross;
    }

    public ProductOnStock purchPriceGross(BigDecimal purchPriceGross) {
        this.purchPriceGross = purchPriceGross;
        return this;
    }

    public void setPurchPriceGross(BigDecimal purchPriceGross) {
        this.purchPriceGross = purchPriceGross;
    }

    public BigDecimal getPurchVatValue() {
        return purchVatValue;
    }

    public ProductOnStock purchVatValue(BigDecimal purchVatValue) {
        this.purchVatValue = purchVatValue;
        return this;
    }

    public void setPurchVatValue(BigDecimal purchVatValue) {
        this.purchVatValue = purchVatValue;
    }

    public BigDecimal getSellPriceNet() {
        return sellPriceNet;
    }

    public ProductOnStock sellPriceNet(BigDecimal sellPriceNet) {
        this.sellPriceNet = sellPriceNet;
        return this;
    }

    public void setSellPriceNet(BigDecimal sellPriceNet) {
        this.sellPriceNet = sellPriceNet;
    }

    public BigDecimal getSellPriceGross() {
        return sellPriceGross;
    }

    public ProductOnStock sellPriceGross(BigDecimal sellPriceGross) {
        this.sellPriceGross = sellPriceGross;
        return this;
    }

    public void setSellPriceGross(BigDecimal sellPriceGross) {
        this.sellPriceGross = sellPriceGross;
    }

    public BigDecimal getSellVatValue() {
        return sellVatValue;
    }

    public ProductOnStock sellVatValue(BigDecimal sellVatValue) {
        this.sellVatValue = sellVatValue;
        return this;
    }

    public void setSellVatValue(BigDecimal sellVatValue) {
        this.sellVatValue = sellVatValue;
    }

    public Product getProduct() {
        return product;
    }

    public ProductOnStock product(Product product) {
        this.product = product;
        return this;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Restaurant getRestaurant() {
        return restaurant;
    }

    public ProductOnStock restaurant(Restaurant restaurant) {
        this.restaurant = restaurant;
        return this;
    }

    public void setRestaurant(Restaurant restaurant) {
        this.restaurant = restaurant;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProductOnStock)) {
            return false;
        }
        return id != null && id.equals(((ProductOnStock) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "ProductOnStock{" +
            "id=" + getId() +
            ", deliveryDate='" + getDeliveryDate() + "'" +
            ", quantity=" + getQuantity() +
            ", purchPriceNet=" + getPurchPriceNet() +
            ", purchPriceGross=" + getPurchPriceGross() +
            ", purchVatValue=" + getPurchVatValue() +
            ", sellPriceNet=" + getSellPriceNet() +
            ", sellPriceGross=" + getSellPriceGross() +
            ", sellVatValue=" + getSellVatValue() +
            "}";
    }
}
