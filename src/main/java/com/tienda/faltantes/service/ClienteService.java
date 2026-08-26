package com.tienda.faltantes.service;

import com.tienda.faltantes.dto.request.ClienteRequestDTO;
import com.tienda.faltantes.dto.response.ClienteResponseDTO;
import com.tienda.faltantes.entity.Cliente;
import com.tienda.faltantes.exception.RecursoDuplicadoException;
import com.tienda.faltantes.exception.RecursoNoEncontradoException;
import com.tienda.faltantes.mapper.ClienteMapper;
import com.tienda.faltantes.repository.ClienteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    private final ClienteRepository repository;
    private final ClienteMapper mapper;

    public ClienteService(ClienteRepository repository,
                          ClienteMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public List<ClienteResponseDTO> listar() {
        return repository.findAll()
                .stream()
                .map(mapper::toResponseDTO)
                .toList();
    }

    public ClienteResponseDTO guardar(ClienteRequestDTO dto) {

        if (repository.existsByDocumento(dto.getDocumento())) {
            throw new RecursoDuplicadoException(
                    "Ya existe un cliente con ese documento"
            );
        }

        Cliente cliente = mapper.toEntity(dto);

        Cliente guardado = repository.save(cliente);

        return mapper.toResponseDTO(guardado);
    }

    public ClienteResponseDTO buscarPorId(Long id) {

        Cliente cliente = repository.findById(id)
                .orElseThrow(() ->
                        new RecursoNoEncontradoException(
                                "Cliente no encontrado"
                        )
                );

        return mapper.toResponseDTO(cliente);
    }

    public ClienteResponseDTO buscarPorDocumento(String documento) {

        Cliente cliente = repository.findByDocumento(documento)
                .orElseThrow(() ->
                        new RecursoNoEncontradoException(
                                "Cliente no encontrado"
                        )
                );

        return mapper.toResponseDTO(cliente);
    }

    public ClienteResponseDTO actualizar(
            Long id,
            ClienteRequestDTO dto) {

        Cliente cliente = repository.findById(id)
                .orElseThrow(() ->
                        new RecursoNoEncontradoException(
                                "Cliente no encontrado"
                        )
                );

        cliente.setNombre(dto.getNombre());
        cliente.setDocumento(dto.getDocumento());
        cliente.setTelefono(dto.getTelefono());
        cliente.setDireccion(dto.getDireccion());

        Cliente actualizado = repository.save(cliente);

        return mapper.toResponseDTO(actualizado);
    }

    public void eliminar(Long id) {

        Cliente cliente = repository.findById(id)
                .orElseThrow(() ->
                        new RecursoNoEncontradoException(
                                "Cliente no encontrado"
                        )
                );

        repository.delete(cliente);
    }
}