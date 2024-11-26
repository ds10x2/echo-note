package com.echonote.domain.Memo.dao;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.echonote.domain.Memo.entity.Memo;

public interface MemoRepository extends MongoRepository<Memo, Long> {

}
