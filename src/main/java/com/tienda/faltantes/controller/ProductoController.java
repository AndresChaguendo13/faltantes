package com.tienda.faltantes.controller;
import com.tienda.faltantes.dto.ProductoDTO;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.tienda.faltantes.entity.Producto;
import com.tienda.faltantes.service.ProductoService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.tienda.faltantes.dto.request.ProductoRequestDTO;
import com.tienda.faltantes.dto.response.ProductoResponseDTO;

import java.util.List;
import java.util.Optional;

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
    public Page<ProductoResponseDTO> listar(Pageable pageable){

        return service.listar(pageable);

    }

    @GetMapping("/buscar")
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO')")
    public Page<ProductoResponseDTO> buscar(

            @RequestParam String nombre,
            Pageable pageable){

        return service.buscarPorNombre(nombre,pageable);

    }

    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")
    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<Producto> buscarPorCodigo(@PathVariable String codigo){

        return service.buscarPorCodigo(codigo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());

    }

    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")
    @GetMapping("/{id}")
    public Optional<Producto> buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductoResponseDTO> guardar(
            @Valid @RequestBody ProductoRequestDTO dto) {

        ProductoResponseDTO nuevo = service.guardar(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Producto actualizar(@PathVariable Long id,
                               @RequestBody Producto producto) {
        return service.actualizar(id, producto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}