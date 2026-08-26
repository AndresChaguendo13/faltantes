package com.tienda.faltantes.controller;

import com.tienda.faltantes.dto.request.VentaRequestDTO;
import com.tienda.faltantes.dto.response.VentaResponseDTO;
import com.tienda.faltantes.service.VentaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ventas")
public class VentaController {

    private final VentaService service;

    public VentaController(VentaService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")
    public ResponseEntity<VentaResponseDTO> guardar(
            @Valid @RequestBody VentaRequestDTO dto) {

        VentaResponseDTO venta = service.guardar(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(venta);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")
    public ResponseEntity<VentaResponseDTO> buscarPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(service.buscarPorId(id));
    }
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")
    public ResponseEntity<List<VentaResponseDTO>> listar() {

        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/total-hoy")
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")
    public ResponseEntity<Double> obtenerTotalVentasHoy() {
        return ResponseEntity.ok(service.obtenerTotalVentasHoy());
    }

    @GetMapping("/total-contado-hoy")
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")
    public ResponseEntity<Double> obtenerTotalContadoHoy() {
        return ResponseEntity.ok(service.obtenerTotalContadoHoy());
    }
    @GetMapping("/total-fiado-hoy")
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")
    public ResponseEntity<Double> obtenerTotalFiadoHoy() {
        return ResponseEntity.ok(service.obtenerTotalFiadoHoy());
    }

    @PutMapping("/{id}/tipo-pago")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VentaResponseDTO> actualizarTipoPago(
            @PathVariable Long id,
            @RequestParam String tipoPago) {

        return ResponseEntity.ok(
                service.actualizarTipoPago(id, tipoPago)
        );
    }



}