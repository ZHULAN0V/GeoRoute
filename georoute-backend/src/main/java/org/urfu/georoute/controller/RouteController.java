package org.urfu.georoute.controller;

import org.apache.commons.lang3.NotImplementedException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/{version}/routes")
public class RouteController {

    @GetMapping(version = "1.0")
    public void getAllRoutes() {
        // TODO: 15.03.2026 добавить хранение маршрутов
        throw new NotImplementedException();
    }

}
