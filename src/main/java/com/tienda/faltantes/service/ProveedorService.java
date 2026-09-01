package com.tienda.faltantes.service;

import com.tienda.faltantes.dto.request.ProveedorRequestDTO;
import com.tienda.faltantes.dto.response.ProveedorResponseDTO;
import com.tienda.faltantes.entity.Proveedor;
import com.tienda.faltantes.exception.RecursoDuplicadoException;
import com.tienda.faltantes.mapper.ProveedorMapper;
import com.tienda.faltantes.repository.ProveedorRepository;
import org.springframework.stereotype.Service;
import com.tienda.faltantes.exception.RecursoNoEncontradoException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProveedorService {

    private final ProveedorRepository repository;
    private final ProveedorMapper mapper;

    public ProveedorService(ProveedorRepository repository,
                            ProveedorMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public List<ProveedorResponseDTO> listar() {
        return repository.findAll()
                .stream()
                .map(mapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public Optional<Proveedor> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public Optional<Proveedor> buscarPorNit(String nit) {
        return repository.findByNit(nit);
    }

    public ProveedorResponseDTO guardar(ProveedorRequestDTO dto) {

        Proveedor proveedor = mapper.toEntity(dto);

        if (repository.existsByNit(proveedor.getNit())) {
            throw new RecursoDuplicadoException("Ya existe un proveedor con ese NIT");
        }

        Proveedor guardado = repository.save(proveedor);

        return mapper.toResponseDTO(guardado);
    }

    public ProveedorResponseDTO actualizar(Long id, ProveedorRequestDTO dto) {

        Proveedor proveedor = repository.findById(id)
                .orElseThrow(() ->
                        new RecursoNoEncontradoException("Proveedor no encontrado"));

        if (!proveedor.getNit().equals(dto.getNit())
                && repository.existsByNit(dto.getNit())) {
            throw new RecursoDuplicadoException(
                    "Ya existe un proveedor con ese NIT");
        }

        proveedor.setNombre(dto.getNombre());
        proveedor.setNit(dto.getNit());
        proveedor.setTelefono(dto.getTelefono());
        proveedor.setCorreo(dto.getCorreo());
        proveedor.setDireccion(dto.getDireccion());

        Proveedor actualizado = repository.save(proveedor);

        return mapper.toResponseDTO(actualizado);
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}