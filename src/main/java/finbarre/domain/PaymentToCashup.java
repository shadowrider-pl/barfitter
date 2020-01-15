package finbarre.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * A PaymentToCashup.
 */
@Entity
@Table(name = "payment_to_cashup")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class PaymentToCashup implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "total_payment", precision = 21, scale = 2)
    private BigDecimal totalPayment;

    @ManyToOne
    @JsonIgnoreProperties("paymentToCashups")
    private Cashup cashup;

    @ManyToOne
    @JsonIgnoreProperties("paymentToCashups")
    private Payment payment;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getTotalPayment() {
        return totalPayment;
    }

    public PaymentToCashup totalPayment(BigDecimal totalPayment) {
        this.totalPayment = totalPayment;
        return this;
    }

    public void setTotalPayment(BigDecimal totalPayment) {
        this.totalPayment = totalPayment;
    }

    public Cashup getCashup() {
        return cashup;
    }

    public PaymentToCashup cashup(Cashup cashup) {
        this.cashup = cashup;
        return this;
    }

    public void setCashup(Cashup cashup) {
        this.cashup = cashup;
    }

    public Payment getPayment() {
        return payment;
    }

    public PaymentToCashup payment(Payment payment) {
        this.payment = payment;
        return this;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PaymentToCashup)) {
            return false;
        }
        return id != null && id.equals(((PaymentToCashup) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "PaymentToCashup{" +
            "id=" + getId() +
            ", totalPayment=" + getTotalPayment() +
            "}";
    }
}
