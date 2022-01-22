package com.ssafy.api.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class PositionDto {

    private String position;
    private int size;

    public PositionDto(String position, int size) {
        this.position = position;
        this.size = size;
    }
}
