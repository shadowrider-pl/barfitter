package finbarre.domain;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.time.LocalDate;

/**
 * A Restaurant.
 */
@Entity
@Table(name = "restaurant")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Restaurant implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "country")
    private String country;

    @Column(name = "address")
    private String address;

    @Column(name = "zip_code")
    private String zipCode;

    @Column(name = "city")
    private String city;

    @Column(name = "vat_number")
    private String vatNumber;

    @Column(name = "licence_date")
    private LocalDate licenceDate;

    @Column(name = "licence_type")
    private String licenceType;

    @Column(name = "next_licence_type")
    private String nextLicenceType;

    @Column(name = "ads_level")
    private Integer adsLevel;

    @Column(name = "currency")
    private String currency;

    @Column(name = "created_date")
    private LocalDate createdDate;

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

    public Restaurant name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCountry() {
        return country;
    }

    public Restaurant country(String country) {
        this.country = country;
        return this;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getAddress() {
        return address;
    }

    public Restaurant address(String address) {
        this.address = address;
        return this;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getZipCode() {
        return zipCode;
    }

    public Restaurant zipCode(String zipCode) {
        this.zipCode = zipCode;
        return this;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public String getCity() {
        return city;
    }

    public Restaurant city(String city) {
        this.city = city;
        return this;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getVatNumber() {
        return vatNumber;
    }

    public Restaurant vatNumber(String vatNumber) {
        this.vatNumber = vatNumber;
        return this;
    }

    public void setVatNumber(String vatNumber) {
        this.vatNumber = vatNumber;
    }

    public LocalDate getLicenceDate() {
        return licenceDate;
    }

    public Restaurant licenceDate(LocalDate licenceDate) {
        this.licenceDate = licenceDate;
        return this;
    }

    public void setLicenceDate(LocalDate licenceDate) {
        this.licenceDate = licenceDate;
    }

    public String getLicenceType() {
        return licenceType;
    }

    public Restaurant licenceType(String licenceType) {
        this.licenceType = licenceType;
        return this;
    }

    public void setLicenceType(String licenceType) {
        this.licenceType = licenceType;
    }

    public String getNextLicenceType() {
        return nextLicenceType;
    }

    public Restaurant nextLicenceType(String nextLicenceType) {
        this.nextLicenceType = nextLicenceType;
        return this;
    }

    public void setNextLicenceType(String nextLicenceType) {
        this.nextLicenceType = nextLicenceType;
    }

    public Integer getAdsLevel() {
        return adsLevel;
    }

    public Restaurant adsLevel(Integer adsLevel) {
        this.adsLevel = adsLevel;
        return this;
    }

    public void setAdsLevel(Integer adsLevel) {
        this.adsLevel = adsLevel;
    }

    public String getCurrency() {
        return currency;
    }

    public Restaurant currency(String currency) {
        this.currency = currency;
        return this;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public LocalDate getCreatedDate() {
        return createdDate;
    }

    public Restaurant createdDate(LocalDate createdDate) {
        this.createdDate = createdDate;
        return this;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Restaurant)) {
            return false;
        }
        return id != null && id.equals(((Restaurant) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Restaurant{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", country='" + getCountry() + "'" +
            ", address='" + getAddress() + "'" +
            ", zipCode='" + getZipCode() + "'" +
            ", city='" + getCity() + "'" +
            ", vatNumber='" + getVatNumber() + "'" +
            ", licenceDate='" + getLicenceDate() + "'" +
            ", licenceType='" + getLicenceType() + "'" +
            ", nextLicenceType='" + getNextLicenceType() + "'" +
            ", adsLevel=" + getAdsLevel() +
            ", currency='" + getCurrency() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            "}";
    }
}
