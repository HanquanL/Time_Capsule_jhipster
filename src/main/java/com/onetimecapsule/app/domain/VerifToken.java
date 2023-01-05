package com.onetimecapsule.app.domain;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.UUID;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

/**
 * A VerifToken.
 */
@Entity
@Table(name = "verif_token")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class VerifToken implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Type(type = "uuid-char")
    @Column(name = "tokenid", length = 36)
    private UUID tokenid;

    @Column(name = "token")
    private String token;

    @Column(name = "expirydate")
    private ZonedDateTime expirydate;

    @OneToOne
    @JoinColumn(unique = true)
    private User userid;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public VerifToken id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UUID getTokenid() {
        return this.tokenid;
    }

    public VerifToken tokenid(UUID tokenid) {
        this.setTokenid(tokenid);
        return this;
    }

    public void setTokenid(UUID tokenid) {
        this.tokenid = tokenid;
    }

    public String getToken() {
        return this.token;
    }

    public VerifToken token(String token) {
        this.setToken(token);
        return this;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public ZonedDateTime getExpirydate() {
        return this.expirydate;
    }

    public VerifToken expirydate(ZonedDateTime expirydate) {
        this.setExpirydate(expirydate);
        return this;
    }

    public void setExpirydate(ZonedDateTime expirydate) {
        this.expirydate = expirydate;
    }

    public User getUserid() {
        return this.userid;
    }

    public void setUserid(User user) {
        this.userid = user;
    }

    public VerifToken userid(User user) {
        this.setUserid(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof VerifToken)) {
            return false;
        }
        return id != null && id.equals(((VerifToken) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "VerifToken{" +
            "id=" + getId() +
            ", tokenid='" + getTokenid() + "'" +
            ", token='" + getToken() + "'" +
            ", expirydate='" + getExpirydate() + "'" +
            "}";
    }
}
