package org.urfu.georoute.service.impl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import org.urfu.georoute.Constants;
import org.urfu.georoute.service.GraphHopperService;

import io.jenetics.jpx.GPX;

@Service
class GraphHopperServiceImpl implements GraphHopperService {

    private final RestClient graphHopperClient;

    GraphHopperServiceImpl(@Qualifier("graphHopperClient") RestClient graphHopperClient) {
        this.graphHopperClient = graphHopperClient;
    }

    @Override
    public GPX match(GPX gpx) {
        GPX matchedGpx = graphHopperClient.post()
            .uri(uriBuilder -> uriBuilder
                .path("/match")
                .queryParam("profile", "foot")
                .queryParam("gpx_accuracy", 20)
                .queryParam("type", "gpx")
                .build()
            )
            .body(gpx)
            .contentType(Constants.APPLICATION_GPX_XML_MEDIATYPE)
            .retrieve()
            .body(GPX.class);

        return Optional.ofNullable(matchedGpx).orElse(gpx);
    }

}
