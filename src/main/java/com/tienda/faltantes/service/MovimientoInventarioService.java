package com.tienda.faltantes.service;

import com.tienda.faltantes.entity.MovimientoInventario;
import com.tienda.faltantes.repository.MovimientoInventarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovimientoInventarioService {

    private final MovimientoInventarioRepository repository;

    public MovimientoInventarioService(MovimientoInventarioRepository repository) {
        this.repository = repository;
    }

    public List<MovimientoInventario> listar() {
        return repository.findAll();
    }

}