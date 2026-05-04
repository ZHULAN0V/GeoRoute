package org.urfu.georoute.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

import org.urfu.georoute.config.converter.GPXConverter;

@Configuration
public class ClientConfig {

    @Bean
    public RestClient graphHopperClient(@Value("${graphhopper.url}") String baseUrl) {
        return RestClient.builder()
            .baseUrl(baseUrl)
            .configureMessageConverters(configurer -> configurer.addCustomConverter(new GPXConverter()))
            .build();
    }

}
