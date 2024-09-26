package com.echonote.domain.Memo.entity;

import java.util.Date;
import java.util.List;

import com.echonote.domain.Memo.dto.MemoRequest;
import jakarta.persistence.*;
import lombok.*;

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

    @OneToMany
    private List<MemoRequest.memoDto> memo;
    // IntelliJ에서 TableDB 구조를 확인할 수 없어서 생긴 에러. 빌드됨

    @CreatedBy
    private Date create_at;

}
