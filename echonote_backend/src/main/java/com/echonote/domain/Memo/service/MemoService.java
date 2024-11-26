package com.echonote.domain.Memo.service;

import com.echonote.domain.Memo.entity.Memo;

import java.util.List;

public interface MemoService {
    // MongoDB에 메모 추가
    Memo saveMemo(Memo list);

    // 메모 업데이트
    Memo updateMemo(Memo list);

    // 메모 삭제하기
    void deleteMemo(long id, List<Long> memoId);

    // 특정 ID로 데이터를 가져오기
    Memo findById(long id);
}
