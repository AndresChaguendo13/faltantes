package com.tienda.faltantes.controller;

import com.tienda.faltantes.dto.request.ProductoRequestDTO;
import com.tienda.faltantes.dto.response.ProductoResponseDTO;
import com.tienda.faltantes.entity.Producto;
import com.tienda.faltantes.service.ProductoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/productos")
public class ProductoController {

    private final ProductoService service;

    public ProductoController(ProductoService service) {
        this.service = service;
    }

    @GetMapping("/stock-bajo")
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")
    public List<Producto> stockBajo() {
        return service.productosConStockBajo();
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO')")
    public Page<ProductoResponseDTO> listar(Pageable pageable) {
        return service.listar(pageable);
    }

    @GetMapping("/buscar")
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO')")
    public Page<ProductoResponseDTO> buscar(
            @RequestParam String nombre,
            Pageable pageable
    ) {
        return service.buscarPorNombre(nombre, pageable);
    }

    @GetMapping("/proveedor/{proveedor}")
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO')")
    public Page<ProductoResponseDTO> buscarPorProveedor(
            @PathVariable String proveedor,
            Pageable pageable
    ) {
        return service.buscarPorProveedor(proveedor, pageable);
    }


    @GetMapping("/codigo/{codigo}")
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")
    public ResponseEntity<Producto> buscarPorCodigo(
            @PathVariable String codigo
    ) {
        return service.buscarPorCodigo(codigo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLEADO', 'CAJERO')")
    public ResponseEntity<Producto> buscar(@PathVariable Long id) {
        return ResponseEntity.of(service.buscarPorId(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductoResponseDTO> guardar(
            @Valid @RequestBody ProductoRequestDTO dto
    ) {
        ProductoResponseDTO nuevo = service.guardar(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(nuevo);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Producto> actualizar(
            @PathVariable Long id,
            @RequestBody Producto producto
    ) {
        Producto actualizado = service.actualizar(id, producto);

        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {

        service.eliminar(id);

        return ResponseEntity.noContent().build();
    }
}