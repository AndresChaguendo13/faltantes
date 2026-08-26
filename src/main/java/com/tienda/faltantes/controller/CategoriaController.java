package com.tienda.faltantes.controller;

import com.tienda.faltantes.entity.Categoria;
import com.tienda.faltantes.service.CategoriaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    private final CategoriaService service;

    public CategoriaController(CategoriaService service) {
        this.service = service;
    }

    @GetMapping
    public List<Categoria> listar() {
        return service.listar();
    }

    @PostMapping
    public ResponseEntity<Categoria> guardar(@RequestBody Categoria categoria) {
        System.out.println("Entró al controlador");
        Categoria nueva = service.guardar(categoria);
        return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
    }
}