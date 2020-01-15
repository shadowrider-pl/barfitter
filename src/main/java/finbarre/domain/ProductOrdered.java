package finbarre.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZonedDateTime;

/**
 * A ProductOrdered.
 */
@Entity
@Table(name = "product_ordered")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class ProductOrdered implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "ordered_time", nullable = false)
    private ZonedDateTime orderedTime;

    @Column(name = "accepted_time")
    private ZonedDateTime acceptedTime;

    @Column(name = "finished_time")
    private ZonedDateTime finishedTime;

    @Column(name = "taken_time")
    private ZonedDateTime takenTime;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "comment")
    private String comment;

    @Column(name = "purch_price_net", precision = 21, scale = 2)
    private BigDecimal purchPriceNet;

    @Column(name = "purch_price_gross", precision = 21, scale = 2)
    private BigDecimal purchPriceGross;

    @Column(name = "purch_vat_value", precision = 21, scale = 2)
    private BigDecimal purchVatValue;

    @Column(name = "sell_price_net", precision = 21, scale = 2)
    private BigDecimal sellPriceNet;

    @Column(name = "sell_price_gross", precision = 21, scale = 2)
    private BigDecimal sellPriceGross;

    @Column(name = "sell_vat_value", precision = 21, scale = 2)
    private BigDecimal sellVatValue;

    @Column(name = "difference", precision = 21, scale = 2)
    private BigDecimal difference;

    @Column(name = "delivery_date")
    private LocalDate deliveryDate;

    @Column(name = "order_position")
    private Integer orderPosition;

    @Column(name = "send_time")
    private ZonedDateTime sendTime;

    @ManyToOne
    @JsonIgnoreProperties("productOrdereds")
    private OrderOpened order;

    @ManyToOne
    @JsonIgnoreProperties("productOrdereds")
    private OrderedProductStatus orderedProductStatus;

    @ManyToOne
    @JsonIgnoreProperties("productOrdereds")
    private Vat productOrderedPurchPriceRate;

    @ManyToOne
    @JsonIgnoreProperties("productOrdereds")
    private Vat productOrderedSellPriceRate;

    @ManyToOne
    @JsonIgnoreProperties("productOrdereds")
    private Product product;

    @ManyToOne
    @JsonIgnoreProperties("productOrdereds")
    private User chef;

    @ManyToOne
    @JsonIgnoreProperties("productOrdereds")
    private Restaurant restaurant;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getOrderedTime() {
        return orderedTime;
    }

    public ProductOrdered orderedTime(ZonedDateTime orderedTime) {
        this.orderedTime = orderedTime;
        return this;
    }

    public void setOrderedTime(ZonedDateTime orderedTime) {
        this.orderedTime = orderedTime;
    }

    public ZonedDateTime getAcceptedTime() {
        return acceptedTime;
    }

    public ProductOrdered acceptedTime(ZonedDateTime acceptedTime) {
        this.acceptedTime = acceptedTime;
        return this;
    }

    public void setAcceptedTime(ZonedDateTime acceptedTime) {
        this.acceptedTime = acceptedTime;
    }

    public ZonedDateTime getFinishedTime() {
        return finishedTime;
    }

    public ProductOrdered finishedTime(ZonedDateTime finishedTime) {
        this.finishedTime = finishedTime;
        return this;
    }

    public void setFinishedTime(ZonedDateTime finishedTime) {
        this.finishedTime = finishedTime;
    }

    public ZonedDateTime getTakenTime() {
        return takenTime;
    }

    public ProductOrdered takenTime(ZonedDateTime takenTime) {
        this.takenTime = takenTime;
        return this;
    }

    public void setTakenTime(ZonedDateTime takenTime) {
        this.takenTime = takenTime;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public ProductOrdered quantity(Integer quantity) {
        this.quantity = quantity;
        return this;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getComment() {
        return comment;
    }

    public ProductOrdered comment(String comment) {
        this.comment = comment;
        return this;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public BigDecimal getPurchPriceNet() {
        return purchPriceNet;
    }

    public ProductOrdered purchPriceNet(BigDecimal purchPriceNet) {
        this.purchPriceNet = purchPriceNet;
        return this;
    }

    public void setPurchPriceNet(BigDecimal purchPriceNet) {
        this.purchPriceNet = purchPriceNet;
    }

    public BigDecimal getPurchPriceGross() {
        return purchPriceGross;
    }

    public ProductOrdered purchPriceGross(BigDecimal purchPriceGross) {
        this.purchPriceGross = purchPriceGross;
        return this;
    }

    public void setPurchPriceGross(BigDecimal purchPriceGross) {
        this.purchPriceGross = purchPriceGross;
    }

    public BigDecimal getPurchVatValue() {
        return purchVatValue;
    }

    public ProductOrdered purchVatValue(BigDecimal purchVatValue) {
        this.purchVatValue = purchVatValue;
        return this;
    }

    public void setPurchVatValue(BigDecimal purchVatValue) {
        this.purchVatValue = purchVatValue;
    }

    public BigDecimal getSellPriceNet() {
        return sellPriceNet;
    }

    public ProductOrdered sellPriceNet(BigDecimal sellPriceNet) {
        this.sellPriceNet = sellPriceNet;
        return this;
    }

    public void setSellPriceNet(BigDecimal sellPriceNet) {
        this.sellPriceNet = sellPriceNet;
    }

    public BigDecimal getSellPriceGross() {
        return sellPriceGross;
    }

    public ProductOrdered sellPriceGross(BigDecimal sellPriceGross) {
        this.sellPriceGross = sellPriceGross;
        return this;
    }

    public void setSellPriceGross(BigDecimal sellPriceGross) {
        this.sellPriceGross = sellPriceGross;
    }

    public BigDecimal getSellVatValue() {
        return sellVatValue;
    }

    public ProductOrdered sellVatValue(BigDecimal sellVatValue) {
        this.sellVatValue = sellVatValue;
        return this;
    }

    public void setSellVatValue(BigDecimal sellVatValue) {
        this.sellVatValue = sellVatValue;
    }

    public BigDecimal getDifference() {
        return difference;
    }

    public ProductOrdered difference(BigDecimal difference) {
        this.difference = difference;
        return this;
    }

    public void setDifference(BigDecimal difference) {
        this.difference = difference;
    }

    public LocalDate getDeliveryDate() {
        return deliveryDate;
    }

    public ProductOrdered deliveryDate(LocalDate deliveryDate) {
        this.deliveryDate = deliveryDate;
        return this;
    }

    public void setDeliveryDate(LocalDate deliveryDate) {
        this.deliveryDate = deliveryDate;
    }

    public Integer getOrderPosition() {
        return orderPosition;
    }

    public ProductOrdered orderPosition(Integer orderPosition) {
        this.orderPosition = orderPosition;
        return this;
    }

    public void setOrderPosition(Integer orderPosition) {
        this.orderPosition = orderPosition;
    }

    public ZonedDateTime getSendTime() {
        return sendTime;
    }

    public ProductOrdered sendTime(ZonedDateTime sendTime) {
        this.sendTime = sendTime;
        return this;
    }

    public void setSendTime(ZonedDateTime sendTime) {
        this.sendTime = sendTime;
    }

    public OrderOpened getOrder() {
        return order;
    }

    public ProductOrdered order(OrderOpened orderOpened) {
        this.order = orderOpened;
        return this;
    }

    public void setOrder(OrderOpened orderOpened) {
        this.order = orderOpened;
    }

    public OrderedProductStatus getOrderedProductStatus() {
        return orderedProductStatus;
    }

    public ProductOrdered orderedProductStatus(OrderedProductStatus orderedProductStatus) {
        this.orderedProductStatus = orderedProductStatus;
        return this;
    }

    public void setOrderedProductStatus(OrderedProductStatus orderedProductStatus) {
        this.orderedProductStatus = orderedProductStatus;
    }

    public Vat getProductOrderedPurchPriceRate() {
        return productOrderedPurchPriceRate;
    }

    public ProductOrdered productOrderedPurchPriceRate(Vat vat) {
        this.productOrderedPurchPriceRate = vat;
        return this;
    }

    public void setProductOrderedPurchPriceRate(Vat vat) {
        this.productOrderedPurchPriceRate = vat;
    }

    public Vat getProductOrderedSellPriceRate() {
        return productOrderedSellPriceRate;
    }

    public ProductOrdered productOrderedSellPriceRate(Vat vat) {
        this.productOrderedSellPriceRate = vat;
        return this;
    }

    public void setProductOrderedSellPriceRate(Vat vat) {
        this.productOrderedSellPriceRate = vat;
    }

    public Product getProduct() {
        return product;
    }

    public ProductOrdered product(Product product) {
        this.product = product;
        return this;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public User getChef() {
        return chef;
    }

    public ProductOrdered chef(User user) {
        this.chef = user;
        return this;
    }

    public void setChef(User user) {
        this.chef = user;
    }

    public Restaurant getRestaurant() {
        return restaurant;
    }

    public ProductOrdered restaurant(Restaurant restaurant) {
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
        if (!(o instanceof ProductOrdered)) {
            return false;
        }
        return id != null && id.equals(((ProductOrdered) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "ProductOrdered{" +
            "id=" + getId() +
            ", orderedTime='" + getOrderedTime() + "'" +
            ", acceptedTime='" + getAcceptedTime() + "'" +
            ", finishedTime='" + getFinishedTime() + "'" +
            ", takenTime='" + getTakenTime() + "'" +
            ", quantity=" + getQuantity() +
            ", comment='" + getComment() + "'" +
            ", purchPriceNet=" + getPurchPriceNet() +
            ", purchPriceGross=" + getPurchPriceGross() +
            ", purchVatValue=" + getPurchVatValue() +
            ", sellPriceNet=" + getSellPriceNet() +
            ", sellPriceGross=" + getSellPriceGross() +
            ", sellVatValue=" + getSellVatValue() +
            ", difference=" + getDifference() +
            ", deliveryDate='" + getDeliveryDate() + "'" +
            ", orderPosition=" + getOrderPosition() +
            ", sendTime='" + getSendTime() + "'" +
            "}";
    }
}
