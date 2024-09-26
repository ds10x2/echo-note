package com.echonote.domain.Memo.dto;

import com.mongodb.lang.Nullable;
import lombok.Builder;
import lombok.Getter;

public class MemoRequest {

    @Getter
    @Builder
    public static class memoDto{
        private long id; // memo_id
        private String memo;

        @Nullable
        private memoTimeStamp timeStamps;
    }

    @Getter
    @Builder
    public static class memoTimeStamp{
        private String start;
        private String end;
    }

}
