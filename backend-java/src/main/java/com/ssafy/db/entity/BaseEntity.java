package com.ssafy.db.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 모델 간 공통 사항 정의.
 */
@Getter
@Setter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public class BaseEntity {

    @CreatedDate
    @Column(name = "created_date", updatable = false)
    LocalDateTime createdDate;

    @LastModifiedDate
    @Column(name = "modified_date")
    LocalDateTime modifiedDate;

    Boolean isDeleted=false;

    @CreatedBy
    @Column(name = "created_by", updatable = false)
    Long createdBy;

    @LastModifiedBy
    Long modifiedBy;
}
