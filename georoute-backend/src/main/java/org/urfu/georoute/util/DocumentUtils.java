package org.urfu.georoute.util;

import java.util.Optional;

import org.w3c.dom.Document;
import org.w3c.dom.Node;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

public final class DocumentUtils {

    private static final DocumentBuilderFactory DOCUMENT_BUILDER_FACTORY = DocumentBuilderFactory.newInstance();

    private DocumentUtils() {
        throw new IllegalStateException("Utility class");
    }

    public static Optional<String> getTagValue(Document document, String tagName) {
        return Optional.ofNullable(document.getElementsByTagName(tagName).item(0)).map(Node::getTextContent);
    }

    public static Document getCopyOf(Document document) throws ParserConfigurationException {
        Document copy = DOCUMENT_BUILDER_FACTORY.newDocumentBuilder().newDocument();

        Node node = copy.importNode(document.getDocumentElement(), true);
        copy.appendChild(node);

        return copy;
    }

}
