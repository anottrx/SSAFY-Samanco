package com.ssafy.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QUserStudy is a Querydsl query type for UserStudy
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QUserStudy extends EntityPathBase<UserStudy> {

    private static final long serialVersionUID = 700446524L;

    public static final QUserStudy userStudy = new QUserStudy("userStudy");

    public final QBaseEntity _super = new QBaseEntity(this);

    //inherited
    public final NumberPath<Long> createdBy = _super.createdBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdDate = _super.createdDate;

    public final NumberPath<Long> id = createNumber("id", Long.class);

    //inherited
    public final BooleanPath isDeleted = _super.isDeleted;

    //inherited
    public final NumberPath<Long> modifiedBy = _super.modifiedBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifiedDate = _super.modifiedDate;

    public final NumberPath<Long> studyId = createNumber("studyId", Long.class);

    public final StringPath studyJoinStatus = createString("studyJoinStatus");

    public final NumberPath<Long> userId = createNumber("userId", Long.class);

    public QUserStudy(String variable) {
        super(UserStudy.class, forVariable(variable));
    }

    public QUserStudy(Path<? extends UserStudy> path) {
        super(path.getType(), path.getMetadata());
    }

    public QUserStudy(PathMetadata metadata) {
        super(UserStudy.class, metadata);
    }

}

