package com.echonote.domain.note.dao;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.echonote.domain.note.entity.Keywords;

@Repository
public interface KeywordRepository extends MongoRepository<Keywords, Long> {

}
