package com.tienda.faltantes.controller;

import com.tienda.faltantes.dto.request.CompraRequestDTO;
import com.tienda.faltantes.entity.Compra;
import com.tienda.faltantes.service.CompraService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/compras")
public class CompraController {

    private final CompraService service;

    public CompraController(CompraService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO')")
    public ResponseEntity<Compra> guardar(@Valid @RequestBody CompraRequestDTO dto) {

        Compra compra = service.guardarCompra(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(compra);
    }

}