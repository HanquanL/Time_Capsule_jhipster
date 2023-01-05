package com.onetimecapsule.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.UUID;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

/**
 * A Post.
 */
@Entity
@Table(name = "post")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Post implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Type(type = "uuid-char")
    @Column(name = "postid", length = 36)
    private UUID postid;

    @NotNull
    @Column(name = "postname", nullable = false)
    private String postname;

    @Column(name = "url")
    private String url;

    @Column(name = "descrption")
    private String descrption;

    @Column(name = "votecount")
    private Integer votecount;

    @ManyToOne
    private User userid;

    @ManyToOne
    @JsonIgnoreProperties(value = { "posts" }, allowSetters = true)
    private SubTimeCapsule subTimeCapsule;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Post id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UUID getPostid() {
        return this.postid;
    }

    public Post postid(UUID postid) {
        this.setPostid(postid);
        return this;
    }

    public void setPostid(UUID postid) {
        this.postid = postid;
    }

    public String getPostname() {
        return this.postname;
    }

    public Post postname(String postname) {
        this.setPostname(postname);
        return this;
    }

    public void setPostname(String postname) {
        this.postname = postname;
    }

    public String getUrl() {
        return this.url;
    }

    public Post url(String url) {
        this.setUrl(url);
        return this;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getDescrption() {
        return this.descrption;
    }

    public Post descrption(String descrption) {
        this.setDescrption(descrption);
        return this;
    }

    public void setDescrption(String descrption) {
        this.descrption = descrption;
    }

    public Integer getVotecount() {
        return this.votecount;
    }

    public Post votecount(Integer votecount) {
        this.setVotecount(votecount);
        return this;
    }

    public void setVotecount(Integer votecount) {
        this.votecount = votecount;
    }

    public User getUserid() {
        return this.userid;
    }

    public void setUserid(User user) {
        this.userid = user;
    }

    public Post userid(User user) {
        this.setUserid(user);
        return this;
    }

    public SubTimeCapsule getSubTimeCapsule() {
        return this.subTimeCapsule;
    }

    public void setSubTimeCapsule(SubTimeCapsule subTimeCapsule) {
        this.subTimeCapsule = subTimeCapsule;
    }

    public Post subTimeCapsule(SubTimeCapsule subTimeCapsule) {
        this.setSubTimeCapsule(subTimeCapsule);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Post)) {
            return false;
        }
        return id != null && id.equals(((Post) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Post{" +
            "id=" + getId() +
            ", postid='" + getPostid() + "'" +
            ", postname='" + getPostname() + "'" +
            ", url='" + getUrl() + "'" +
            ", descrption='" + getDescrption() + "'" +
            ", votecount=" + getVotecount() +
            "}";
    }
}
