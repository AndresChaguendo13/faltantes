package com.tienda.faltantes.controller;

import com.tienda.faltantes.dto.request.AbonoRequestDTO;
import com.tienda.faltantes.dto.response.AbonoResponseDTO;
import com.tienda.faltantes.service.AbonoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fiados")
public class AbonoController {

    private final AbonoService service;

    public AbonoController(AbonoService service) {
        this.service = service;
    }

    @PostMapping("/{fiadoId}/abonos")
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")
    public ResponseEntity<AbonoResponseDTO> registrarAbono(
            @PathVariable Long fiadoId,
            @Valid @RequestBody AbonoRequestDTO dto) {

        AbonoResponseDTO abono =
                service.registrarAbono(fiadoId, dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(abono);
    }

    @GetMapping("/{fiadoId}/abonos")
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")
    public List<AbonoResponseDTO> listarPorFiado(
            @PathVariable Long fiadoId) {

        return service.listarPorFiado(fiadoId);
    }
}