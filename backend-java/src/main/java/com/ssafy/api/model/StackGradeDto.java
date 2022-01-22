package com.ssafy.api.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class StackGradeDto {

    private String name;
    private int grade;

    public StackGradeDto(String name, int grade) {
        this.name=name;
        this.grade=grade;
    }
}
