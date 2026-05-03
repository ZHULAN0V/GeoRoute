package org.urfu.georoute.config.converter;

import java.io.IOException;

import org.springframework.http.HttpInputMessage;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.converter.AbstractHttpMessageConverter;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.urfu.georoute.Constants;

import io.jenetics.jpx.GPX;

public class GPXConverter extends AbstractHttpMessageConverter<GPX> {

    public GPXConverter() {
        super(Constants.APPLICATION_GPX_XML_MEDIATYPE);
    }

    @Override
    protected boolean supports(Class<?> clazz) {
        return GPX.class.isAssignableFrom(clazz);
    }

    @Override
    protected GPX readInternal(Class<? extends GPX> clazz, HttpInputMessage inputMessage)
            throws IOException, HttpMessageNotReadableException {
        return GPX.Reader.DEFAULT.read(inputMessage.getBody());
    }

    @Override
    protected void writeInternal(GPX gpx, HttpOutputMessage outputMessage)
            throws IOException, HttpMessageNotWritableException {
        GPX.Writer.DEFAULT.write(gpx, outputMessage.getBody());
    }

}
