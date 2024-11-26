package com.echonote.domain.Memo.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.Date;

public class MemoResponse {
    @Getter
    @Builder
    public static class memoDto {
        private final long id; // memo_id
        private final Date timestamp_start;
        private final Date timestamp_end;
    }
}
