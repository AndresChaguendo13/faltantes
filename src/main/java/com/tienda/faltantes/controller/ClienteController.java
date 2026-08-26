package com.tienda.faltantes.controller;

import com.tienda.faltantes.dto.request.ClienteRequestDTO;
import com.tienda.faltantes.dto.response.ClienteResponseDTO;
import com.tienda.faltantes.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteService service;

    public ClienteController(ClienteService service) {
        this.service = service;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO')")
    public List<ClienteResponseDTO> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO')")
    public ClienteResponseDTO buscarPorId(
            @PathVariable Long id) {

        return service.buscarPorId(id);
    }

    @GetMapping("/documento/{documento}")
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")
    public ClienteResponseDTO buscarPorDocumento(
            @PathVariable String documento) {

        return service.buscarPorDocumento(documento);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO')")
    public ResponseEntity<ClienteResponseDTO> guardar(
            @Valid @RequestBody ClienteRequestDTO dto) {

        ClienteResponseDTO cliente = service.guardar(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(cliente);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO')")
    public ClienteResponseDTO actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ClienteRequestDTO dto) {

        return service.actualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long id) {

        service.eliminar(id);

        return ResponseEntity.noContent().build();
    }
}