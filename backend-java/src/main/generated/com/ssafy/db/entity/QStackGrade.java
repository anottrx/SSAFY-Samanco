package com.ssafy.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QStackGrade is a Querydsl query type for StackGrade
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QStackGrade extends EntityPathBase<StackGrade> {

    private static final long serialVersionUID = 661066609L;

    public static final QStackGrade stackGrade = new QStackGrade("stackGrade");

    public final QBaseEntity _super = new QBaseEntity(this);

    //inherited
    public final NumberPath<Long> createdBy = _super.createdBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdDate = _super.createdDate;

    public final NumberPath<Integer> grade = createNumber("grade", Integer.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    //inherited
    public final BooleanPath isDeleted = _super.isDeleted;

    //inherited
    public final NumberPath<Long> modifiedBy = _super.modifiedBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifiedDate = _super.modifiedDate;

    public final StringPath name = createString("name");

    public final NumberPath<Long> projectId = createNumber("projectId", Long.class);

    public final NumberPath<Long> studyId = createNumber("studyId", Long.class);

    public final NumberPath<Long> userId = createNumber("userId", Long.class);

    public QStackGrade(String variable) {
        super(StackGrade.class, forVariable(variable));
    }

    public QStackGrade(Path<? extends StackGrade> path) {
        super(path.getType(), path.getMetadata());
    }

    public QStackGrade(PathMetadata metadata) {
        super(StackGrade.class, metadata);
    }

}

