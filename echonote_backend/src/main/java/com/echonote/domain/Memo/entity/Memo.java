package com.echonote.domain.Memo.entity;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.echonote.domain.Memo.dto.MemoRequest;
import com.mongodb.lang.Nullable;
import jakarta.persistence.*;
import lombok.*;

import org.aspectj.lang.annotation.RequiredTypes;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.mongodb.core.mapping.Document;


// @Entity << 이게 JPA 관련 어노테이션이라 이걸 추가하는 순간 Mongo Repository 와 JPA Repository가 충돌한다
@Getter
@Builder(toBuilder = true)
@ToString
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Document(collection = "memo")
public class Memo {

    @Id
    private long id;

    @Nullable
    private Map<String, List<MemoRequest.MemoText>> text;

    @Nullable
    private Map<String, List<MemoRequest.MemoText>> rectangle;

    @Nullable
    private Map<String, List<MemoRequest.MemoText>> circle;
}
