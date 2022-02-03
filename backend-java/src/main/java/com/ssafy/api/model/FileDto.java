package com.ssafy.api.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class FileDto {

    private String saveFolder;
    private String saveFile;
    private String originFile;
    private byte[] imageByteArr;

}
