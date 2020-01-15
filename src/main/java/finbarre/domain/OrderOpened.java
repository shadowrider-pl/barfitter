package finbarre.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.ZonedDateTime;

/**
 * A OrderOpened.
 */
@Entity
@Table(name = "order_opened")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class OrderOpened implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "total", precision = 21, scale = 2)
    private BigDecimal total;

    @Column(name = "comment")
    private String comment;

    @Column(name = "opening_time")
    private ZonedDateTime openingTime;

    @Column(name = "closing_time")
    private ZonedDateTime closingTime;

    @Column(name = "order_id")
    private Long orderId;

    @ManyToOne
    @JsonIgnoreProperties("orderOpeneds")
    private Payment payment;

    @ManyToOne
    @JsonIgnoreProperties("orderOpeneds")
    private Desk desk;

    @ManyToOne
    @JsonIgnoreProperties("orderOpeneds")
    private User barman;

    @ManyToOne
    @JsonIgnoreProperties("orderOpeneds")
    private Restaurant restaurant;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public OrderOpened total(BigDecimal total) {
        this.total = total;
        return this;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public String getComment() {
        return comment;
    }

    public OrderOpened comment(String comment) {
        this.comment = comment;
        return this;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public ZonedDateTime getOpeningTime() {
        return openingTime;
    }

    public OrderOpened openingTime(ZonedDateTime openingTime) {
        this.openingTime = openingTime;
        return this;
    }

    public void setOpeningTime(ZonedDateTime openingTime) {
        this.openingTime = openingTime;
    }

    public ZonedDateTime getClosingTime() {
        return closingTime;
    }

    public OrderOpened closingTime(ZonedDateTime closingTime) {
        this.closingTime = closingTime;
        return this;
    }

    public void setClosingTime(ZonedDateTime closingTime) {
        this.closingTime = closingTime;
    }

    public Long getOrderId() {
        return orderId;
    }

    public OrderOpened orderId(Long orderId) {
        this.orderId = orderId;
        return this;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Payment getPayment() {
        return payment;
    }

    public OrderOpened payment(Payment payment) {
        this.payment = payment;
        return this;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }

    public Desk getDesk() {
        return desk;
    }

    public OrderOpened desk(Desk desk) {
        this.desk = desk;
        return this;
    }

    public void setDesk(Desk desk) {
        this.desk = desk;
    }

    public User getBarman() {
        return barman;
    }

    public OrderOpened barman(User user) {
        this.barman = user;
        return this;
    }

    public void setBarman(User user) {
        this.barman = user;
    }

    public Restaurant getRestaurant() {
        return restaurant;
    }

    public OrderOpened restaurant(Restaurant restaurant) {
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
        if (!(o instanceof OrderOpened)) {
            return false;
        }
        return id != null && id.equals(((OrderOpened) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "OrderOpened{" +
            "id=" + getId() +
            ", total=" + getTotal() +
            ", comment='" + getComment() + "'" +
            ", openingTime='" + getOpeningTime() + "'" +
            ", closingTime='" + getClosingTime() + "'" +
            ", orderId=" + getOrderId() +
            "}";
    }
}
