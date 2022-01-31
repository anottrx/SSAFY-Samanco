package com.ssafy.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QUserLike is a Querydsl query type for UserLike
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QUserLike extends EntityPathBase<UserLike> {

    private static final long serialVersionUID = -254719036L;

    public static final QUserLike userLike = new QUserLike("userLike");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath tag = createString("tag");

    public final NumberPath<Long> tagId = createNumber("tagId", Long.class);

    public final NumberPath<Long> userId = createNumber("userId", Long.class);

    public QUserLike(String variable) {
        super(UserLike.class, forVariable(variable));
    }

    public QUserLike(Path<? extends UserLike> path) {
        super(path.getType(), path.getMetadata());
    }

    public QUserLike(PathMetadata metadata) {
        super(UserLike.class, metadata);
    }

}

