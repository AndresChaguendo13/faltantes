package com.tienda.faltantes.controller;

import com.tienda.faltantes.dto.request.UsuarioRequestDTO;
import com.tienda.faltantes.dto.request.UsuarioUpdateRequestDTO;
import com.tienda.faltantes.dto.request.CambiarPasswordRequestDTO;
import com.tienda.faltantes.dto.response.UsuarioResponseDTO;
import com.tienda.faltantes.service.UsuarioService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    // =====================================================
    // CREAR USUARIO
    // =====================================================

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioResponseDTO> guardar(
            @Valid @RequestBody UsuarioRequestDTO dto) {

        UsuarioResponseDTO response =
                service.guardar(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // =====================================================
    // MI PERFIL
    // =====================================================

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UsuarioResponseDTO> miPerfil(
            Authentication authentication) {

        String username =
                authentication.getName();

        return ResponseEntity.ok(
                service.obtenerMiPerfil(username)
        );
    }


    // =====================================================
    // CAMBIAR MI CONTRASEÑA
    // =====================================================

    @PutMapping("/me/password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> cambiarPassword(
            @Valid @RequestBody CambiarPasswordRequestDTO dto,
            Authentication authentication) {

        String username =
                authentication.getName();

        service.cambiarPassword(
                username,
                dto
        );

        return ResponseEntity.noContent().build();
    }


    // =====================================================
    // ACTUALIZAR USUARIO — SOLO ADMIN
    // =====================================================

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioResponseDTO> actualizar(
            @PathVariable Long id,
            @RequestBody UsuarioUpdateRequestDTO dto) {

        UsuarioResponseDTO response =
                service.actualizar(id, dto);

        return ResponseEntity.ok(response);
    }


    // =====================================================
    // LISTAR USUARIOS — SOLO ADMIN
    // =====================================================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UsuarioResponseDTO>> listar() {

        return ResponseEntity.ok(
                service.listar()
        );
    }

}