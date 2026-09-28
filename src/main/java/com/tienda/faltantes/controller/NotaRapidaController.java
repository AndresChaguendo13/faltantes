package com.tienda.faltantes.controller;

import com.tienda.faltantes.dto.request.NotaRapidaRequestDTO;
import com.tienda.faltantes.dto.response.NotaRapidaResponseDTO;
import com.tienda.faltantes.service.NotaRapidaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notas-rapidas")
public class NotaRapidaController {

    private final NotaRapidaService service;

    public NotaRapidaController(NotaRapidaService service) {
        this.service = service;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")
    public List<NotaRapidaResponseDTO> listar() {
        return service.listar();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")
    public ResponseEntity<NotaRapidaResponseDTO> crear(
            @Valid @RequestBody NotaRapidaRequestDTO dto
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.crear(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")
    public ResponseEntity<NotaRapidaResponseDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody NotaRapidaRequestDTO dto
    ) {
        return ResponseEntity.ok(service.actualizar(id, dto));
    }

    @PatchMapping("/{id}/completar")
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")
    public ResponseEntity<NotaRapidaResponseDTO> alternarCompletada(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(service.alternarCompletada(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
