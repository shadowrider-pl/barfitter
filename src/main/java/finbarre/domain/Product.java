package finbarre.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * A Product.
 */
@Entity
@Table(name = "product")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Product implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "purch_price_net", precision = 21, scale = 2)
    private BigDecimal purchPriceNet;

    @NotNull
    @Column(name = "sell_price_gross", precision = 21, scale = 2, nullable = false)
    private BigDecimal sellPriceGross;

    @Column(name = "active")
    private Boolean active;

    @Column(name = "purch_price_gross", precision = 21, scale = 2)
    private BigDecimal purchPriceGross;

    @Column(name = "purch_vat_value", precision = 21, scale = 2)
    private BigDecimal purchVatValue;

    @Column(name = "sell_price_net", precision = 21, scale = 2)
    private BigDecimal sellPriceNet;

    @Column(name = "sell_vat_value", precision = 21, scale = 2)
    private BigDecimal sellVatValue;

    @ManyToOne
    @JsonIgnoreProperties("products")
    private Vat productSellPriceRate;

    @ManyToOne
    @JsonIgnoreProperties("products")
    private Vat productPurchPriceRate;

    @ManyToOne
    @JsonIgnoreProperties("products")
    private ProductType productType;

    @ManyToOne
    @JsonIgnoreProperties("products")
    private Category category;

    @ManyToOne
    @JsonIgnoreProperties("products")
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

    public Product name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getPurchPriceNet() {
        return purchPriceNet;
    }

    public Product purchPriceNet(BigDecimal purchPriceNet) {
        this.purchPriceNet = purchPriceNet;
        return this;
    }

    public void setPurchPriceNet(BigDecimal purchPriceNet) {
        this.purchPriceNet = purchPriceNet;
    }

    public BigDecimal getSellPriceGross() {
        return sellPriceGross;
    }

    public Product sellPriceGross(BigDecimal sellPriceGross) {
        this.sellPriceGross = sellPriceGross;
        return this;
    }

    public void setSellPriceGross(BigDecimal sellPriceGross) {
        this.sellPriceGross = sellPriceGross;
    }

    public Boolean isActive() {
        return active;
    }

    public Product active(Boolean active) {
        this.active = active;
        return this;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public BigDecimal getPurchPriceGross() {
        return purchPriceGross;
    }

    public Product purchPriceGross(BigDecimal purchPriceGross) {
        this.purchPriceGross = purchPriceGross;
        return this;
    }

    public void setPurchPriceGross(BigDecimal purchPriceGross) {
        this.purchPriceGross = purchPriceGross;
    }

    public BigDecimal getPurchVatValue() {
        return purchVatValue;
    }

    public Product purchVatValue(BigDecimal purchVatValue) {
        this.purchVatValue = purchVatValue;
        return this;
    }

    public void setPurchVatValue(BigDecimal purchVatValue) {
        this.purchVatValue = purchVatValue;
    }

    public BigDecimal getSellPriceNet() {
        return sellPriceNet;
    }

    public Product sellPriceNet(BigDecimal sellPriceNet) {
        this.sellPriceNet = sellPriceNet;
        return this;
    }

    public void setSellPriceNet(BigDecimal sellPriceNet) {
        this.sellPriceNet = sellPriceNet;
    }

    public BigDecimal getSellVatValue() {
        return sellVatValue;
    }

    public Product sellVatValue(BigDecimal sellVatValue) {
        this.sellVatValue = sellVatValue;
        return this;
    }

    public void setSellVatValue(BigDecimal sellVatValue) {
        this.sellVatValue = sellVatValue;
    }

    public Vat getProductSellPriceRate() {
        return productSellPriceRate;
    }

    public Product productSellPriceRate(Vat vat) {
        this.productSellPriceRate = vat;
        return this;
    }

    public void setProductSellPriceRate(Vat vat) {
        this.productSellPriceRate = vat;
    }

    public Vat getProductPurchPriceRate() {
        return productPurchPriceRate;
    }

    public Product productPurchPriceRate(Vat vat) {
        this.productPurchPriceRate = vat;
        return this;
    }

    public void setProductPurchPriceRate(Vat vat) {
        this.productPurchPriceRate = vat;
    }

    public ProductType getProductType() {
        return productType;
    }

    public Product productType(ProductType productType) {
        this.productType = productType;
        return this;
    }

    public void setProductType(ProductType productType) {
        this.productType = productType;
    }

    public Category getCategory() {
        return category;
    }

    public Product category(Category category) {
        this.category = category;
        return this;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Restaurant getRestaurant() {
        return restaurant;
    }

    public Product restaurant(Restaurant restaurant) {
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
        if (!(o instanceof Product)) {
            return false;
        }
        return id != null && id.equals(((Product) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Product{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", purchPriceNet=" + getPurchPriceNet() +
            ", sellPriceGross=" + getSellPriceGross() +
            ", active='" + isActive() + "'" +
            ", purchPriceGross=" + getPurchPriceGross() +
            ", purchVatValue=" + getPurchVatValue() +
            ", sellPriceNet=" + getSellPriceNet() +
            ", sellVatValue=" + getSellVatValue() +
            "}";
    }
}
