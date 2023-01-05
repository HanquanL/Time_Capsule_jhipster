package com.onetimecapsule.app.domain;

import java.io.Serializable;
import java.util.UUID;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

/**
 * A UserUploadFile.
 */
@Entity
@Table(name = "user_upload_file")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserUploadFile implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Type(type = "uuid-char")
    @Column(name = "fileid", length = 36)
    private UUID fileid;

    @NotNull
    @Column(name = "filename", nullable = false)
    private String filename;

    @Column(name = "contentype")
    private String contentype;

    @Column(name = "filesize")
    private String filesize;

    @Lob
    @Column(name = "filedata")
    private byte[] filedata;

    @Column(name = "filedata_content_type")
    private String filedataContentType;

    @ManyToOne
    private User userid;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public UserUploadFile id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UUID getFileid() {
        return this.fileid;
    }

    public UserUploadFile fileid(UUID fileid) {
        this.setFileid(fileid);
        return this;
    }

    public void setFileid(UUID fileid) {
        this.fileid = fileid;
    }

    public String getFilename() {
        return this.filename;
    }

    public UserUploadFile filename(String filename) {
        this.setFilename(filename);
        return this;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getContentype() {
        return this.contentype;
    }

    public UserUploadFile contentype(String contentype) {
        this.setContentype(contentype);
        return this;
    }

    public void setContentype(String contentype) {
        this.contentype = contentype;
    }

    public String getFilesize() {
        return this.filesize;
    }

    public UserUploadFile filesize(String filesize) {
        this.setFilesize(filesize);
        return this;
    }

    public void setFilesize(String filesize) {
        this.filesize = filesize;
    }

    public byte[] getFiledata() {
        return this.filedata;
    }

    public UserUploadFile filedata(byte[] filedata) {
        this.setFiledata(filedata);
        return this;
    }

    public void setFiledata(byte[] filedata) {
        this.filedata = filedata;
    }

    public String getFiledataContentType() {
        return this.filedataContentType;
    }

    public UserUploadFile filedataContentType(String filedataContentType) {
        this.filedataContentType = filedataContentType;
        return this;
    }

    public void setFiledataContentType(String filedataContentType) {
        this.filedataContentType = filedataContentType;
    }

    public User getUserid() {
        return this.userid;
    }

    public void setUserid(User user) {
        this.userid = user;
    }

    public UserUploadFile userid(User user) {
        this.setUserid(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserUploadFile)) {
            return false;
        }
        return id != null && id.equals(((UserUploadFile) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserUploadFile{" +
            "id=" + getId() +
            ", fileid='" + getFileid() + "'" +
            ", filename='" + getFilename() + "'" +
            ", contentype='" + getContentype() + "'" +
            ", filesize='" + getFilesize() + "'" +
            ", filedata='" + getFiledata() + "'" +
            ", filedataContentType='" + getFiledataContentType() + "'" +
            "}";
    }
}
