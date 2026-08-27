package com.tienda.faltantes.controller;

import com.tienda.faltantes.dto.response.ReporteUtilidadResponseDTO;
import com.tienda.faltantes.service.ReporteUtilidadService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/reportes")
public class ReporteUtilidadController {

    private final ReporteUtilidadService service;

    public ReporteUtilidadController(ReporteUtilidadService service) {
        this.service = service;
    }

    @GetMapping("/utilidad")
    public ReporteUtilidadResponseDTO obtenerReporte(
            @RequestParam LocalDateTime fechaInicio,
            @RequestParam LocalDateTime fechaFin) {

        return service.obtenerReporte(fechaInicio, fechaFin);
    }
}