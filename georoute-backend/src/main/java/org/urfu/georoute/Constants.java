package org.urfu.georoute;

import org.springframework.http.MediaType;

public final class Constants {

    private Constants() {
        throw new IllegalStateException("Utility class");
    }

    public static final String APPLICATION_GPX_XML_VALUE = "application/gpx+xml";
    public static final MediaType APPLICATION_GPX_XML_MEDIATYPE = MediaType.valueOf(APPLICATION_GPX_XML_VALUE);

}
