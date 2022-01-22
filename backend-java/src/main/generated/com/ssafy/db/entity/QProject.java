package com.ssafy.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QProject is a Querydsl query type for Project
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QProject extends EntityPathBase<Project> {

    private static final long serialVersionUID = -863112937L;

    public static final QProject project = new QProject("project");

    public final QBaseEntity _super = new QBaseEntity(this);

    public final StringPath collectStatus = createString("collectStatus");

    //inherited
    public final NumberPath<Long> createdBy = _super.createdBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdDate = _super.createdDate;

    public final NumberPath<Integer> currentBackendSize = createNumber("currentBackendSize", Integer.class);

    public final NumberPath<Integer> currentEmbeddedSize = createNumber("currentEmbeddedSize", Integer.class);

    public final NumberPath<Integer> currentFrontendSize = createNumber("currentFrontendSize", Integer.class);

    public final NumberPath<Integer> currentMobileSize = createNumber("currentMobileSize", Integer.class);

    public final StringPath description = createString("description");

    public final StringPath endDate = createString("endDate");

    public final NumberPath<Long> hit = createNumber("hit", Long.class);

    public final NumberPath<Long> hostId = createNumber("hostId", Long.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    //inherited
    public final BooleanPath isDeleted = _super.isDeleted;

    public final NumberPath<Long> likes = createNumber("likes", Long.class);

    //inherited
    public final NumberPath<Long> modifiedBy = _super.modifiedBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifiedDate = _super.modifiedDate;

    public final NumberPath<Integer> size = createNumber("size", Integer.class);

    public final StringPath startDate = createString("startDate");

    public final StringPath title = createString("title");

    public final NumberPath<Integer> totalBackendSize = createNumber("totalBackendSize", Integer.class);

    public final NumberPath<Integer> totalEmbeddedSize = createNumber("totalEmbeddedSize", Integer.class);

    public final NumberPath<Integer> totalFrontendSize = createNumber("totalFrontendSize", Integer.class);

    public final NumberPath<Integer> totalMobileSize = createNumber("totalMobileSize", Integer.class);

    public QProject(String variable) {
        super(Project.class, forVariable(variable));
    }

    public QProject(Path<? extends Project> path) {
        super(path.getType(), path.getMetadata());
    }

    public QProject(PathMetadata metadata) {
        super(Project.class, metadata);
    }

}

