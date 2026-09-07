package com.tienda.faltantes.controller;

import com.tienda.faltantes.dto.request.MovimientoCajaRequestDTO;
import com.tienda.faltantes.dto.response.MovimientoCajaResponseDTO;
import com.tienda.faltantes.service.MovimientoCajaService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/movimientos-caja")
public class MovimientoCajaController {

    private final MovimientoCajaService service;

    public MovimientoCajaController(MovimientoCajaService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")
    public MovimientoCajaResponseDTO registrar(
            @Valid @RequestBody MovimientoCajaRequestDTO request) {

        return service.registrar(request);
    }

    @GetMapping("/caja/{cajaId}")
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")
    public List<MovimientoCajaResponseDTO> listarPorCaja(
            @PathVariable Long cajaId) {

        return service.listarPorCaja(cajaId);
    }
}