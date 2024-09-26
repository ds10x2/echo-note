package com.echonote.domain.Memo.service;

import com.echonote.domain.Memo.entity.Memo;

public interface MemoService {
    // MongoDB에 메모 추가
    void insertMemo(Memo list);

    // 메모 업데이트
    void updateMemo(Memo list);

    // 메모 삭제하기
    void deleteMemo(long id);

    // 특정 ID로 데이터를 가져오기
    Memo findById(long id);
}
