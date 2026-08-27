package com.tienda.faltantes.controller;

import com.tienda.faltantes.dto.response.ReporteComprasResponseDTO;
import com.tienda.faltantes.service.ReporteComprasService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/reportes")
public class ReporteComprasController {

    private final ReporteComprasService service;

    public ReporteComprasController(ReporteComprasService service) {
        this.service = service;
    }

    @GetMapping("/compras")
    public ReporteComprasResponseDTO obtenerReporte(
            @RequestParam LocalDateTime fechaInicio,
            @RequestParam LocalDateTime fechaFin) {

        return service.obtenerReporte(fechaInicio, fechaFin);
    }
}