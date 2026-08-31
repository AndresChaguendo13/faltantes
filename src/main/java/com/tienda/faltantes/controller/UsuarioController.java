package com.tienda.faltantes.controller;

import com.tienda.faltantes.dto.request.UsuarioRequestDTO;
import com.tienda.faltantes.dto.response.UsuarioResponseDTO;
import com.tienda.faltantes.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.tienda.faltantes.dto.request.UsuarioUpdateRequestDTO;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioResponseDTO> guardar(
            @Valid @RequestBody UsuarioRequestDTO dto) {

        UsuarioResponseDTO response = service.guardar(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioResponseDTO> actualizar(
            @PathVariable Long id,
            @RequestBody UsuarioUpdateRequestDTO dto) {

        UsuarioResponseDTO response = service.actualizar(id, dto);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UsuarioResponseDTO>> listar() {

        return ResponseEntity.ok(service.listar());
    }

}