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
 * A Cashup.
 */
@Entity
@Table(name = "cashup")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Cashup implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "barman_login_time", nullable = false)
    private ZonedDateTime barmanLoginTime;

    @Column(name = "cashup_time")
    private ZonedDateTime cashupTime;

    @Column(name = "start_cash", precision = 21, scale = 2)
    private BigDecimal startCash;

    @Column(name = "end_cash", precision = 21, scale = 2)
    private BigDecimal endCash;

    @Column(name = "total_sale", precision = 21, scale = 2)
    private BigDecimal totalSale;

    @Column(name = "cash_taken_by_manager", precision = 21, scale = 2)
    private BigDecimal cashTakenByManager;

    @Column(name = "cash_taken_by_boss", precision = 21, scale = 2)
    private BigDecimal cashTakenByBoss;

    @Column(name = "comment")
    private String comment;

    @ManyToOne
    @JsonIgnoreProperties("cashups")
    private User cashupUser;

    @ManyToOne
    @JsonIgnoreProperties("cashups")
    private User openingUser;

    @ManyToOne
    @JsonIgnoreProperties("cashups")
    private Restaurant restaurant;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getBarmanLoginTime() {
        return barmanLoginTime;
    }

    public Cashup barmanLoginTime(ZonedDateTime barmanLoginTime) {
        this.barmanLoginTime = barmanLoginTime;
        return this;
    }

    public void setBarmanLoginTime(ZonedDateTime barmanLoginTime) {
        this.barmanLoginTime = barmanLoginTime;
    }

    public ZonedDateTime getCashupTime() {
        return cashupTime;
    }

    public Cashup cashupTime(ZonedDateTime cashupTime) {
        this.cashupTime = cashupTime;
        return this;
    }

    public void setCashupTime(ZonedDateTime cashupTime) {
        this.cashupTime = cashupTime;
    }

    public BigDecimal getStartCash() {
        return startCash;
    }

    public Cashup startCash(BigDecimal startCash) {
        this.startCash = startCash;
        return this;
    }

    public void setStartCash(BigDecimal startCash) {
        this.startCash = startCash;
    }

    public BigDecimal getEndCash() {
        return endCash;
    }

    public Cashup endCash(BigDecimal endCash) {
        this.endCash = endCash;
        return this;
    }

    public void setEndCash(BigDecimal endCash) {
        this.endCash = endCash;
    }

    public BigDecimal getTotalSale() {
        return totalSale;
    }

    public Cashup totalSale(BigDecimal totalSale) {
        this.totalSale = totalSale;
        return this;
    }

    public void setTotalSale(BigDecimal totalSale) {
        this.totalSale = totalSale;
    }

    public BigDecimal getCashTakenByManager() {
        return cashTakenByManager;
    }

    public Cashup cashTakenByManager(BigDecimal cashTakenByManager) {
        this.cashTakenByManager = cashTakenByManager;
        return this;
    }

    public void setCashTakenByManager(BigDecimal cashTakenByManager) {
        this.cashTakenByManager = cashTakenByManager;
    }

    public BigDecimal getCashTakenByBoss() {
        return cashTakenByBoss;
    }

    public Cashup cashTakenByBoss(BigDecimal cashTakenByBoss) {
        this.cashTakenByBoss = cashTakenByBoss;
        return this;
    }

    public void setCashTakenByBoss(BigDecimal cashTakenByBoss) {
        this.cashTakenByBoss = cashTakenByBoss;
    }

    public String getComment() {
        return comment;
    }

    public Cashup comment(String comment) {
        this.comment = comment;
        return this;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public User getCashupUser() {
        return cashupUser;
    }

    public Cashup cashupUser(User user) {
        this.cashupUser = user;
        return this;
    }

    public void setCashupUser(User user) {
        this.cashupUser = user;
    }

    public User getOpeningUser() {
        return openingUser;
    }

    public Cashup openingUser(User user) {
        this.openingUser = user;
        return this;
    }

    public void setOpeningUser(User user) {
        this.openingUser = user;
    }

    public Restaurant getRestaurant() {
        return restaurant;
    }

    public Cashup restaurant(Restaurant restaurant) {
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
        if (!(o instanceof Cashup)) {
            return false;
        }
        return id != null && id.equals(((Cashup) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Cashup{" +
            "id=" + getId() +
            ", barmanLoginTime='" + getBarmanLoginTime() + "'" +
            ", cashupTime='" + getCashupTime() + "'" +
            ", startCash=" + getStartCash() +
            ", endCash=" + getEndCash() +
            ", totalSale=" + getTotalSale() +
            ", cashTakenByManager=" + getCashTakenByManager() +
            ", cashTakenByBoss=" + getCashTakenByBoss() +
            ", comment='" + getComment() + "'" +
            "}";
    }
}
