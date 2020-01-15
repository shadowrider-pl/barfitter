package finbarre.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.ZonedDateTime;

/**
 * A OrderClosed.
 */
@Entity
@Table(name = "order_closed")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class OrderClosed implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "opening_time", nullable = false)
    private ZonedDateTime openingTime;

    @NotNull
    @Column(name = "closing_time", nullable = false)
    private ZonedDateTime closingTime;

    @Column(name = "total", precision = 21, scale = 2)
    private BigDecimal total;

    @Column(name = "comment")
    private String comment;

    @Column(name = "order_id")
    private Long orderId;

    @ManyToOne
    @JsonIgnoreProperties("orderCloseds")
    private Cashup cashupDay;

    @ManyToOne
    @JsonIgnoreProperties("orderCloseds")
    private Desk desk;

    @ManyToOne
    @JsonIgnoreProperties("orderCloseds")
    private Payment payment;

    @ManyToOne
    @JsonIgnoreProperties("orderCloseds")
    private User barman;

    @ManyToOne
    @JsonIgnoreProperties("orderCloseds")
    private Restaurant restaurant;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getOpeningTime() {
        return openingTime;
    }

    public OrderClosed openingTime(ZonedDateTime openingTime) {
        this.openingTime = openingTime;
        return this;
    }

    public void setOpeningTime(ZonedDateTime openingTime) {
        this.openingTime = openingTime;
    }

    public ZonedDateTime getClosingTime() {
        return closingTime;
    }

    public OrderClosed closingTime(ZonedDateTime closingTime) {
        this.closingTime = closingTime;
        return this;
    }

    public void setClosingTime(ZonedDateTime closingTime) {
        this.closingTime = closingTime;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public OrderClosed total(BigDecimal total) {
        this.total = total;
        return this;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public String getComment() {
        return comment;
    }

    public OrderClosed comment(String comment) {
        this.comment = comment;
        return this;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Long getOrderId() {
        return orderId;
    }

    public OrderClosed orderId(Long orderId) {
        this.orderId = orderId;
        return this;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Cashup getCashupDay() {
        return cashupDay;
    }

    public OrderClosed cashupDay(Cashup cashup) {
        this.cashupDay = cashup;
        return this;
    }

    public void setCashupDay(Cashup cashup) {
        this.cashupDay = cashup;
    }

    public Desk getDesk() {
        return desk;
    }

    public OrderClosed desk(Desk desk) {
        this.desk = desk;
        return this;
    }

    public void setDesk(Desk desk) {
        this.desk = desk;
    }

    public Payment getPayment() {
        return payment;
    }

    public OrderClosed payment(Payment payment) {
        this.payment = payment;
        return this;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }

    public User getBarman() {
        return barman;
    }

    public OrderClosed barman(User user) {
        this.barman = user;
        return this;
    }

    public void setBarman(User user) {
        this.barman = user;
    }

    public Restaurant getRestaurant() {
        return restaurant;
    }

    public OrderClosed restaurant(Restaurant restaurant) {
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
        if (!(o instanceof OrderClosed)) {
            return false;
        }
        return id != null && id.equals(((OrderClosed) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "OrderClosed{" +
            "id=" + getId() +
            ", openingTime='" + getOpeningTime() + "'" +
            ", closingTime='" + getClosingTime() + "'" +
            ", total=" + getTotal() +
            ", comment='" + getComment() + "'" +
            ", orderId=" + getOrderId() +
            "}";
    }
}
