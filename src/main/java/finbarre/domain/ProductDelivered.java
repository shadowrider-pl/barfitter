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
 * A ProductDelivered.
 */
@Entity
@Table(name = "product_delivered")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class ProductDelivered implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "delivery_date")
    private LocalDate deliveryDate;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "purch_price_gross", precision = 21, scale = 2)
    private BigDecimal purchPriceGross;

    @NotNull
    @Column(name = "sell_price_gross", precision = 21, scale = 2, nullable = false)
    private BigDecimal sellPriceGross;

    @Column(name = "purch_price_net", precision = 21, scale = 2)
    private BigDecimal purchPriceNet;

    @Column(name = "purch_vat_value", precision = 21, scale = 2)
    private BigDecimal purchVatValue;

    @Column(name = "sell_price_net", precision = 21, scale = 2)
    private BigDecimal sellPriceNet;

    @Column(name = "sell_vat_value", precision = 21, scale = 2)
    private BigDecimal sellVatValue;

    @ManyToOne
    @JsonIgnoreProperties("productDelivereds")
    private Product product;

    @ManyToOne
    @JsonIgnoreProperties("productDelivereds")
    private Category category;

    @ManyToOne
    @JsonIgnoreProperties("productDelivereds")
    private Vat productDeliveredPurchPriceRate;

    @ManyToOne
    @JsonIgnoreProperties("productDelivereds")
    private Vat productDeliveredSellPriceRate;

    @ManyToOne
    @JsonIgnoreProperties("productDelivereds")
    private ProductType productType;

    @ManyToOne
    @JsonIgnoreProperties("productDelivereds")
    private Restaurant restaurant;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public ProductDelivered name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getDeliveryDate() {
        return deliveryDate;
    }

    public ProductDelivered deliveryDate(LocalDate deliveryDate) {
        this.deliveryDate = deliveryDate;
        return this;
    }

    public void setDeliveryDate(LocalDate deliveryDate) {
        this.deliveryDate = deliveryDate;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public ProductDelivered quantity(Integer quantity) {
        this.quantity = quantity;
        return this;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPurchPriceGross() {
        return purchPriceGross;
    }

    public ProductDelivered purchPriceGross(BigDecimal purchPriceGross) {
        this.purchPriceGross = purchPriceGross;
        return this;
    }

    public void setPurchPriceGross(BigDecimal purchPriceGross) {
        this.purchPriceGross = purchPriceGross;
    }

    public BigDecimal getSellPriceGross() {
        return sellPriceGross;
    }

    public ProductDelivered sellPriceGross(BigDecimal sellPriceGross) {
        this.sellPriceGross = sellPriceGross;
        return this;
    }

    public void setSellPriceGross(BigDecimal sellPriceGross) {
        this.sellPriceGross = sellPriceGross;
    }

    public BigDecimal getPurchPriceNet() {
        return purchPriceNet;
    }

    public ProductDelivered purchPriceNet(BigDecimal purchPriceNet) {
        this.purchPriceNet = purchPriceNet;
        return this;
    }

    public void setPurchPriceNet(BigDecimal purchPriceNet) {
        this.purchPriceNet = purchPriceNet;
    }

    public BigDecimal getPurchVatValue() {
        return purchVatValue;
    }

    public ProductDelivered purchVatValue(BigDecimal purchVatValue) {
        this.purchVatValue = purchVatValue;
        return this;
    }

    public void setPurchVatValue(BigDecimal purchVatValue) {
        this.purchVatValue = purchVatValue;
    }

    public BigDecimal getSellPriceNet() {
        return sellPriceNet;
    }

    public ProductDelivered sellPriceNet(BigDecimal sellPriceNet) {
        this.sellPriceNet = sellPriceNet;
        return this;
    }

    public void setSellPriceNet(BigDecimal sellPriceNet) {
        this.sellPriceNet = sellPriceNet;
    }

    public BigDecimal getSellVatValue() {
        return sellVatValue;
    }

    public ProductDelivered sellVatValue(BigDecimal sellVatValue) {
        this.sellVatValue = sellVatValue;
        return this;
    }

    public void setSellVatValue(BigDecimal sellVatValue) {
        this.sellVatValue = sellVatValue;
    }

    public Product getProduct() {
        return product;
    }

    public ProductDelivered product(Product product) {
        this.product = product;
        return this;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Category getCategory() {
        return category;
    }

    public ProductDelivered category(Category category) {
        this.category = category;
        return this;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Vat getProductDeliveredPurchPriceRate() {
        return productDeliveredPurchPriceRate;
    }

    public ProductDelivered productDeliveredPurchPriceRate(Vat vat) {
        this.productDeliveredPurchPriceRate = vat;
        return this;
    }

    public void setProductDeliveredPurchPriceRate(Vat vat) {
        this.productDeliveredPurchPriceRate = vat;
    }

    public Vat getProductDeliveredSellPriceRate() {
        return productDeliveredSellPriceRate;
    }

    public ProductDelivered productDeliveredSellPriceRate(Vat vat) {
        this.productDeliveredSellPriceRate = vat;
        return this;
    }

    public void setProductDeliveredSellPriceRate(Vat vat) {
        this.productDeliveredSellPriceRate = vat;
    }

    public ProductType getProductType() {
        return productType;
    }

    public ProductDelivered productType(ProductType productType) {
        this.productType = productType;
        return this;
    }

    public void setProductType(ProductType productType) {
        this.productType = productType;
    }

    public Restaurant getRestaurant() {
        return restaurant;
    }

    public ProductDelivered restaurant(Restaurant restaurant) {
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
        if (!(o instanceof ProductDelivered)) {
            return false;
        }
        return id != null && id.equals(((ProductDelivered) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "ProductDelivered{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", deliveryDate='" + getDeliveryDate() + "'" +
            ", quantity=" + getQuantity() +
            ", purchPriceGross=" + getPurchPriceGross() +
            ", sellPriceGross=" + getSellPriceGross() +
            ", purchPriceNet=" + getPurchPriceNet() +
            ", purchVatValue=" + getPurchVatValue() +
            ", sellPriceNet=" + getSellPriceNet() +
            ", sellVatValue=" + getSellVatValue() +
            "}";
    }
}
