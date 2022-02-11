package com.ssafy.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QEmailCode is a Querydsl query type for EmailCode
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QEmailCode extends EntityPathBase<EmailCode> {

    private static final long serialVersionUID = -1803067865L;

    public static final QEmailCode emailCode = new QEmailCode("emailCode");

    public final QBaseEntity _super = new QBaseEntity(this);

    public final StringPath code = createString("code");

    //inherited
    public final NumberPath<Long> createdBy = _super.createdBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdDate = _super.createdDate;

    public final StringPath email = createString("email");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    //inherited
    public final BooleanPath isDeleted = _super.isDeleted;

    //inherited
    public final NumberPath<Long> modifiedBy = _super.modifiedBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifiedDate = _super.modifiedDate;

    public final StringPath tag = createString("tag");

    public QEmailCode(String variable) {
        super(EmailCode.class, forVariable(variable));
    }

    public QEmailCode(Path<? extends EmailCode> path) {
        super(path.getType(), path.getMetadata());
    }

    public QEmailCode(PathMetadata metadata) {
        super(EmailCode.class, metadata);
    }

}

