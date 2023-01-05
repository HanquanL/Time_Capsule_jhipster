package com.onetimecapsule.app.domain.enumeration;

/**
 * The VoteType enumeration.
 */
public enum VoteType {
    UPVOTE("1"),
    DOWNVOTE("-1");

    private final String value;

    VoteType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
