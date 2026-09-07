package com.tienda.faltantes.controller;

import com.tienda.faltantes.dto.request.AjusteInventarioRequestDTO;
import com.tienda.faltantes.entity.MovimientoInventario;
import com.tienda.faltantes.service.MovimientoInventarioService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/movimientos")
public class MovimientoInventarioController {

    private final MovimientoInventarioService service;

    public MovimientoInventarioController(MovimientoInventarioService service) {
        this.service = service;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")
    public List<MovimientoInventario> listar() {
        return service.listar();
    }

    @PostMapping("/ajuste")
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")
    public MovimientoInventario ajustarStock(
            @RequestBody AjusteInventarioRequestDTO dto) {

        return service.ajustarStock(dto);
    }
}