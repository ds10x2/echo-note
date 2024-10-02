package com.echonote.domain.Voice.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
public class STTSearchRequest {
    private String keyword;
}
