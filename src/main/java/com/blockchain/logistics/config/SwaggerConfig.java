package com.blockchain.logistics.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ParameterBuilder;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.schema.ModelRef;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.service.Parameter;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.Collections;
import java.util.List;

import static springfox.documentation.builders.PathSelectors.any;

@Configuration
@EnableSwagger2
public class SwaggerConfig {

    @Bean
    public Docket docket() {
        return new Docket(DocumentationType.SWAGGER_2)
                .globalOperationParameters(operationParameters())
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.blockchain.logistics.controller"))
                .paths(any())
                .build()
                .apiInfo(buildApiInfo());
    }

    private ApiInfo buildApiInfo() {
        return new ApiInfo("Logistics App", "POC Application", "1", "",
                new Contact("", "", ""), "", "", Collections.emptyList());
    }

    private List<Parameter> operationParameters() {
        return Collections.singletonList(
                new ParameterBuilder().name("Authorization")
                        .description("Bearer token")
                        .defaultValue("Bearer ")
                        .modelRef(new ModelRef("string")).parameterType("header")
                        .required(true)
                        .build());
    }
}
