package com.echonote.global.swagger;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;

import io.swagger.v3.core.converter.ModelConverters;
import io.swagger.v3.core.jackson.ModelResolver;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import java.util.Arrays;

@Configuration
public class SwaggerConfig {
	@Bean
	public OpenAPI openAPI() {
		return new OpenAPI()
			.components(new Components())
			.info(apiInfo())
			.servers(Arrays.asList(
				new Server().url("https://REMOVED/api")
			));
	}

	private Info apiInfo() {
		return new Info()
			.title("Echonote API") // API의 제목
			.description("Echonote의 Swagger입니다.") // API에 대한 설명
			.version("1.0.0"); // API의 버전
	}

	// swagger에도 snake_case 적용 (1)
	@Bean
	public ModelResolver modelResolver(ObjectMapper objectMapper) {
		objectMapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
		return new ModelResolver(objectMapper);
	}

	// swagger에도 snake_case 적용 (2)
	@Bean
	public ModelConverters modelConverters(ModelResolver modelResolver) {
		ModelConverters.getInstance().addConverter(modelResolver);
		return ModelConverters.getInstance();
	}

}
