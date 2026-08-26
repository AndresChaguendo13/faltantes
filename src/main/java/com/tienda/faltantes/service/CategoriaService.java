package com.tienda.faltantes.service;

import com.tienda.faltantes.entity.Categoria;
import com.tienda.faltantes.repository.CategoriaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService {

    private final CategoriaRepository repository;

    public CategoriaService(CategoriaRepository repository) {
        this.repository = repository;
    }

    public List<Categoria> listar() {
        return repository.findAll();
    }

    public Optional<Categoria> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public Categoria guardar(Categoria categoria) {

        if (repository.existsByNombre(categoria.getNombre())) {
            throw new RuntimeException("La categoría ya existe");
        }

        return repository.save(categoria);
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}