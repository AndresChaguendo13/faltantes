package com.tienda.faltantes.controller;

import com.tienda.faltantes.dto.response.ReporteVentasResponseDTO;
import com.tienda.faltantes.service.ReporteVentasService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/reportes")
public class ReporteVentasController {

    private final ReporteVentasService service;

    public ReporteVentasController(ReporteVentasService service) {
        this.service = service;
    }

    @GetMapping("/ventas")
    public ReporteVentasResponseDTO obtenerReporte(
            @RequestParam LocalDateTime fechaInicio,
            @RequestParam LocalDateTime fechaFin) {

        return service.obtenerReporte(fechaInicio, fechaFin);
    }
}