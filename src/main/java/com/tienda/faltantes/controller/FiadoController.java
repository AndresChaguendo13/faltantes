package com.tienda.faltantes.controller;

import com.tienda.faltantes.dto.request.FiadoRequestDTO;
import com.tienda.faltantes.dto.response.FiadoDetalleResponseDTO;
import com.tienda.faltantes.dto.response.FiadoResponseDTO;
import com.tienda.faltantes.service.FiadoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.tienda.faltantes.dto.response.EstadoCuentaResponseDTO;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/fiados")
public class FiadoController {

    private final FiadoService service;

    public FiadoController(FiadoService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")
    public ResponseEntity<FiadoResponseDTO> guardar(
            @Valid @RequestBody FiadoRequestDTO dto) {

        FiadoResponseDTO fiado = service.guardar(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(fiado);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")
    public List<FiadoResponseDTO> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")
    public FiadoResponseDTO buscarPorId(
            @PathVariable Long id) {

        return service.buscarPorId(id);
    }

    @GetMapping("/cliente/{clienteId}/saldo")
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")
    public BigDecimal calcularSaldoCliente(
            @PathVariable Long clienteId) {

        return service.calcularSaldoCliente(clienteId);
    }

    @GetMapping("/cliente/{clienteId}")
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")
    public List<FiadoResponseDTO> listarPorCliente(
            @PathVariable Long clienteId) {

        return service.listarPorCliente(clienteId);
    }

    @GetMapping("/cliente/{clienteId}/estado-cuenta")
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")
    public EstadoCuentaResponseDTO obtenerEstadoCuenta(
            @PathVariable Long clienteId) {

        return service.obtenerEstadoCuenta(clienteId);
    }

    @GetMapping("/{fiadoId}/detalle")
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")
    public FiadoDetalleResponseDTO obtenerDetalle(
            @PathVariable Long fiadoId) {

        return service.obtenerDetalle(fiadoId);
    }
}