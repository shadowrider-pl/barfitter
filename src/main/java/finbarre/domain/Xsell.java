package finbarre.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;

/**
 * A Xsell.
 */
@Entity
@Table(name = "xsell")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Xsell implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonIgnoreProperties("xsells")
    private Category fromCategory;

    @ManyToOne
    @JsonIgnoreProperties("xsells")
    private Category toCategory;

    @ManyToOne
    @JsonIgnoreProperties("xsells")
    private Restaurant restaurant;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Category getFromCategory() {
        return fromCategory;
    }

    public Xsell fromCategory(Category category) {
        this.fromCategory = category;
        return this;
    }

    public void setFromCategory(Category category) {
        this.fromCategory = category;
    }

    public Category getToCategory() {
        return toCategory;
    }

    public Xsell toCategory(Category category) {
        this.toCategory = category;
        return this;
    }

    public void setToCategory(Category category) {
        this.toCategory = category;
    }

    public Restaurant getRestaurant() {
        return restaurant;
    }

    public Xsell restaurant(Restaurant restaurant) {
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
        if (!(o instanceof Xsell)) {
            return false;
        }
        return id != null && id.equals(((Xsell) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Xsell{" +
            "id=" + getId() +
            "}";
    }
}
