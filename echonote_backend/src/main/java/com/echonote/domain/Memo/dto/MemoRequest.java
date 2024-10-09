package com.echonote.domain.Memo.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;
import java.util.Map;

public class MemoRequest {

    @Getter
    @Builder
    @ToString
    public static class MemoText {
        private long id;
        private String detail;
    }
}
