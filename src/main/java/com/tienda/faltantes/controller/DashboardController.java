package com.tienda.faltantes.controller;

import com.tienda.faltantes.dto.response.DashboardResponseDTO;
import com.tienda.faltantes.service.DashboardService;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")
    public DashboardResponseDTO obtenerDashboard() {
        return service.obtenerDashboard();
    }
}