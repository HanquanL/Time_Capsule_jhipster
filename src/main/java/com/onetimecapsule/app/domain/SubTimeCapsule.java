package com.onetimecapsule.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

/**
 * A SubTimeCapsule.
 */
@Entity
@Table(name = "sub_time_capsule")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SubTimeCapsule implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Type(type = "uuid-char")
    @Column(name = "subtimecapsuleid", length = 36)
    private UUID subtimecapsuleid;

    @Column(name = "subtimecapsulename")
    private String subtimecapsulename;

    @Column(name = "description")
    private String description;

    @Column(name = "createdate")
    private ZonedDateTime createdate;

    @OneToMany(mappedBy = "subTimeCapsule")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "userid", "subTimeCapsule" }, allowSetters = true)
    private Set<Post> posts = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public SubTimeCapsule id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UUID getSubtimecapsuleid() {
        return this.subtimecapsuleid;
    }

    public SubTimeCapsule subtimecapsuleid(UUID subtimecapsuleid) {
        this.setSubtimecapsuleid(subtimecapsuleid);
        return this;
    }

    public void setSubtimecapsuleid(UUID subtimecapsuleid) {
        this.subtimecapsuleid = subtimecapsuleid;
    }

    public String getSubtimecapsulename() {
        return this.subtimecapsulename;
    }

    public SubTimeCapsule subtimecapsulename(String subtimecapsulename) {
        this.setSubtimecapsulename(subtimecapsulename);
        return this;
    }

    public void setSubtimecapsulename(String subtimecapsulename) {
        this.subtimecapsulename = subtimecapsulename;
    }

    public String getDescription() {
        return this.description;
    }

    public SubTimeCapsule description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ZonedDateTime getCreatedate() {
        return this.createdate;
    }

    public SubTimeCapsule createdate(ZonedDateTime createdate) {
        this.setCreatedate(createdate);
        return this;
    }

    public void setCreatedate(ZonedDateTime createdate) {
        this.createdate = createdate;
    }

    public Set<Post> getPosts() {
        return this.posts;
    }

    public void setPosts(Set<Post> posts) {
        if (this.posts != null) {
            this.posts.forEach(i -> i.setSubTimeCapsule(null));
        }
        if (posts != null) {
            posts.forEach(i -> i.setSubTimeCapsule(this));
        }
        this.posts = posts;
    }

    public SubTimeCapsule posts(Set<Post> posts) {
        this.setPosts(posts);
        return this;
    }

    public SubTimeCapsule addPost(Post post) {
        this.posts.add(post);
        post.setSubTimeCapsule(this);
        return this;
    }

    public SubTimeCapsule removePost(Post post) {
        this.posts.remove(post);
        post.setSubTimeCapsule(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SubTimeCapsule)) {
            return false;
        }
        return id != null && id.equals(((SubTimeCapsule) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SubTimeCapsule{" +
            "id=" + getId() +
            ", subtimecapsuleid='" + getSubtimecapsuleid() + "'" +
            ", subtimecapsulename='" + getSubtimecapsulename() + "'" +
            ", description='" + getDescription() + "'" +
            ", createdate='" + getCreatedate() + "'" +
            "}";
    }
}
