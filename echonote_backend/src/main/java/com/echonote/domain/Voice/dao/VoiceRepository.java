package com.echonote.domain.Voice.dao;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.echonote.domain.Voice.entity.STT;

public interface VoiceRepository extends MongoRepository<STT, Long> {

}
