package org.urfu.georoute.service.impl;

import java.util.List;
import java.util.stream.Stream;

import org.springframework.stereotype.Service;

import org.urfu.georoute.service.GraphHopperService;
import org.urfu.georoute.service.MapMatchingService;
import org.urfu.georoute.util.DocumentUtils;

import io.jenetics.jpx.GPX;
import io.jenetics.jpx.Track;
import io.jenetics.jpx.TrackSegment;
import javax.xml.parsers.ParserConfigurationException;

@Service
class MapMatchingServiceImpl implements MapMatchingService {

    private static final String MATCH_XML_TAG = "georoute:match";

    private final GraphHopperService graphHopperService;

    public MapMatchingServiceImpl(GraphHopperService graphHopperService) {
        this.graphHopperService = graphHopperService;
    }

    @Override
    public GPX match(GPX gpx) {
        return gpx.toBuilder()
            .tracks(gpx.tracks().map(this::match).toList())
            .build();
    }

    private Track match(Track track) {
        // TODO: 04.05.2026 не самый оптимальный подход, лучше матчить не последовательно по одному,
        //  а все сразу параллельно
        List<TrackSegment> matchedSegments = track.segments()
            .map(trackSegment -> shouldBeMatched(trackSegment) ? match(trackSegment) : trackSegment)
            .toList();

        return track.toBuilder().segments(matchedSegments).build();
    }

    private TrackSegment match(TrackSegment segment) {
        GPX requestGpx = GPX.builder()
            .addTrack(Track.builder().addSegment(segment).build())
            .build();

        GPX matchedGpx = graphHopperService.match(requestGpx);

        return matchedGpx.tracks()
            .findFirst()
            .map(Track::segments)
            .orElse(Stream.of())
            .findFirst()
            .map(matchedSegment -> withExtensionsOf(segment, matchedSegment))
            .orElse(segment);
    }

    private boolean shouldBeMatched(TrackSegment trackSegment) {
        return trackSegment.getExtensions()
            .flatMap(document -> DocumentUtils.getTagValue(document, MATCH_XML_TAG))
            .map(Boolean::parseBoolean)
            .orElse(true);
    }

    private TrackSegment withExtensionsOf(TrackSegment source, TrackSegment target) {
        if (source.getExtensions().isEmpty()) {
            return target;
        }

        try {
            return target.toBuilder()
                .extensions(DocumentUtils.getCopyOf(source.getExtensions().get()))
                .build();
        } catch (ParserConfigurationException e) {
            throw new RuntimeException(e);
        }
    }

}
