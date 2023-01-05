package com.onetimecapsule.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.onetimecapsule.app.domain.enumeration.VoteType;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Vote.
 */
@Entity
@Table(name = "vote")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Vote implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "vote_type")
    private VoteType voteType;

    @ManyToOne
    private User userid;

    @ManyToOne
    @JsonIgnoreProperties(value = { "userid", "subTimeCapsule" }, allowSetters = true)
    private Post postid;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Vote id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public VoteType getVoteType() {
        return this.voteType;
    }

    public Vote voteType(VoteType voteType) {
        this.setVoteType(voteType);
        return this;
    }

    public void setVoteType(VoteType voteType) {
        this.voteType = voteType;
    }

    public User getUserid() {
        return this.userid;
    }

    public void setUserid(User user) {
        this.userid = user;
    }

    public Vote userid(User user) {
        this.setUserid(user);
        return this;
    }

    public Post getPostid() {
        return this.postid;
    }

    public void setPostid(Post post) {
        this.postid = post;
    }

    public Vote postid(Post post) {
        this.setPostid(post);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Vote)) {
            return false;
        }
        return id != null && id.equals(((Vote) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Vote{" +
            "id=" + getId() +
            ", voteType='" + getVoteType() + "'" +
            "}";
    }
}
