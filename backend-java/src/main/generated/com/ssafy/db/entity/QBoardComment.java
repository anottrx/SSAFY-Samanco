package com.ssafy.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QBoardComment is a Querydsl query type for BoardComment
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QBoardComment extends EntityPathBase<BoardComment> {

    private static final long serialVersionUID = 2138870107L;

    public static final QBoardComment boardComment = new QBoardComment("boardComment");

    public final QBaseEntity _super = new QBaseEntity(this);

    public final NumberPath<Long> boardId = createNumber("boardId", Long.class);

    public final StringPath content = createString("content");

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

    public final NumberPath<Long> userId = createNumber("userId", Long.class);

    public QBoardComment(String variable) {
        super(BoardComment.class, forVariable(variable));
    }

    public QBoardComment(Path<? extends BoardComment> path) {
        super(path.getType(), path.getMetadata());
    }

    public QBoardComment(PathMetadata metadata) {
        super(BoardComment.class, metadata);
    }

}

