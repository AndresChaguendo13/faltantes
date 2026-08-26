package com.tienda.faltantes.controller;

import com.tienda.faltantes.entity.MovimientoInventario;
import com.tienda.faltantes.service.MovimientoInventarioService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/movimientos")
public class MovimientoInventarioController {

    private final MovimientoInventarioService service;

    public MovimientoInventarioController(MovimientoInventarioService service) {
        this.service = service;
    }

    @GetMapping
    public List<MovimientoInventario> listar() {
        return service.listar();
    }

}