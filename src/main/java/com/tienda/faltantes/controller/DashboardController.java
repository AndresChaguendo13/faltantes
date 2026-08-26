package com.tienda.faltantes.controller;

import com.tienda.faltantes.dto.response.DashboardResponseDTO;
import com.tienda.faltantes.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private final DashboardService service;

    public DashboardController(DashboardService service) {
        this.service = service;
    }

    @GetMapping
    public DashboardResponseDTO obtenerDashboard() {
        return service.obtenerDashboard();
    }
}