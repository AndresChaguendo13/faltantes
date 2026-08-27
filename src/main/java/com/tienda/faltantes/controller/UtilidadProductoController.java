package com.tienda.faltantes.controller;

import com.tienda.faltantes.dto.response.UtilidadProductoResponseDTO;
import com.tienda.faltantes.service.UtilidadProductoService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/reportes")
public class UtilidadProductoController {

    private final UtilidadProductoService service;

    public UtilidadProductoController(UtilidadProductoService service) {
        this.service = service;
    }

    @GetMapping("/utilidad/productos")
    public List<UtilidadProductoResponseDTO> obtenerUtilidadPorProducto(
            @RequestParam LocalDateTime fechaInicio,
            @RequestParam LocalDateTime fechaFin) {

        return service.obtenerUtilidadPorProducto(
                fechaInicio,
                fechaFin
        );
    }
}