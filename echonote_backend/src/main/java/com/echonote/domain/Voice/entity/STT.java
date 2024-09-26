package com.echonote.domain.Voice.entity;

import com.echonote.domain.Voice.dto.STTRequest;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Document(collection = "STT")
public class STT {
    private long id;
    private List<STTRequest> result;
}
