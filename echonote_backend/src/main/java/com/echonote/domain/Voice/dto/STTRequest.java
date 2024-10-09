package com.echonote.domain.Voice.dto;

import java.util.Optional;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
public class STTRequest {

    private long id;
    private String start;
    private String end;
    private String text;

    @Builder.Default
    private boolean anomaly = false;

    public void changeAnomaly(boolean anomaly) {
        this.anomaly = anomaly;
    }
}
