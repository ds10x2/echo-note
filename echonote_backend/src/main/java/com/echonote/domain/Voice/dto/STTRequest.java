package com.echonote.domain.Voice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class STTRequest {

    private long id;
    private String start;
    private String end;
    private String text;
    private boolean isAnomaly;

    public void setAnomaly(boolean status) {
        this.isAnomaly = status;
    }

}
