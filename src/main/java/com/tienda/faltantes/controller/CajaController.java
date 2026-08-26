package com.tienda.faltantes.controller;

import com.tienda.faltantes.dto.request.CajaAperturaRequestDTO;
import com.tienda.faltantes.dto.response.CajaDetalleResponseDTO;
import com.tienda.faltantes.dto.response.CajaResponseDTO;
import com.tienda.faltantes.entity.Caja;
import com.tienda.faltantes.service.CajaService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.tienda.faltantes.dto.request.CajaCierreRequestDTO;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/caja")
public class CajaController {

    private final CajaService service;

    public CajaController(CajaService service) {
        this.service = service;
    }

    @GetMapping("/resumen-hoy")
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")
    public CajaResponseDTO obtenerResumenHoy() {
        return service.obtenerResumenHoy();
    }


    @PostMapping("/abrir")
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")
    public Caja abrirCaja(@Valid @RequestBody CajaAperturaRequestDTO request) {
        return service.abrirCaja(request);
    }

    @GetMapping("/actual")
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")
    public Caja obtenerCajaAbierta() {
        return service.obtenerCajaAbierta();
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")
    public List<Caja> listarCajas() {
        return service.listarCajas();
    }
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")
    public CajaDetalleResponseDTO buscarPorId(@PathVariable Long id) {
        return service.obtenerDetalle(id);
    }

    @PostMapping("/cerrar")
    @PreAuthorize("hasAnyRole('ADMIN','CAJERO')")
    public Caja cerrarCaja(@Valid @RequestBody CajaCierreRequestDTO request) {
        return service.cerrarCaja(request);
    }
}