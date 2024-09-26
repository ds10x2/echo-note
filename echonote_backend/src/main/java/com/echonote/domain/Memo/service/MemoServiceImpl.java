package com.echonote.domain.Memo.service;

import com.echonote.domain.Memo.dao.MemoRepository;
import com.echonote.domain.Memo.dto.MemoRequest;
import com.echonote.domain.Memo.entity.Memo;
import com.mongodb.client.result.UpdateResult;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemoServiceImpl implements MemoService {

    private final MemoRepository memoRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    // MongoDB에 메모 추가
    @Override
    public void insertMemo(Memo list) {
        memoRepository.insert(list);
    }

    // 메모 업데이트
    @Override
    public void updateMemo (Memo list){
        long id = list.getId();

        for(MemoRequest.memoDto memo : list.getMemo()){
            Query query = new Query(Criteria.where("_id").is(id).and("memo._id").is(memo.getId()));
            Update update = new Update().set("memo.$.memo", memo.getMemo());
//            mongoTemplate.updateFirst(query, update, Memo.class);
            // 업데이트 실행
            try {
                UpdateResult result = mongoTemplate.updateFirst(query, update, Memo.class);
                if (result.getMatchedCount() == 0) {
                    System.out.println("해당 메모 항목을 찾을 수 없습니다: " + memo.getId());
                }
            } catch (DataIntegrityViolationException e) {
                System.err.println("데이터 무결성 위반: " + e.getMessage());
                // 추가적인 에러 로깅을 여기서 할 수 있습니다.
            }

        }
//        memoRepository.save(list);
    }

    // 메모 삭제하기
    @Override
    public void deleteMemo(long id){
        memoRepository.deleteById(id);
    }

    // 특정 ID로 데이터를 가져오기
    @Override
    public Memo findById(long id) {
        return memoRepository.findById(id).orElse(null);
    }

}
