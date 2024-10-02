package com.echonote.domain.Voice.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class STTRequest {
    private Long id;
    private String start;
    private String end;
    private String text;
}
