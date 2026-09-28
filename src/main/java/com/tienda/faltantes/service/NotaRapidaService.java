package com.tienda.faltantes.service;

import com.tienda.faltantes.dto.request.NotaRapidaRequestDTO;
import com.tienda.faltantes.dto.response.NotaRapidaResponseDTO;
import com.tienda.faltantes.entity.NotaRapida;
import com.tienda.faltantes.exception.RecursoNoEncontradoException;
import com.tienda.faltantes.repository.NotaRapidaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotaRapidaService {

    private final NotaRapidaRepository repository;

    public NotaRapidaService(NotaRapidaRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<NotaRapidaResponseDTO> listar() {
        return repository.findAllByOrderByEstadoAscFechaActualizacionDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public NotaRapidaResponseDTO crear(NotaRapidaRequestDTO dto) {
        NotaRapida nota = new NotaRapida();
        nota.setTitulo(dto.getTitulo().trim());
        nota.setDescripcion(dto.getDescripcion().trim());
        nota.setFechaAlerta(dto.getFechaAlerta());
        nota.setAlarma(Boolean.TRUE.equals(dto.getAlarma()));
        nota.setEstado("PENDIENTE");

        return toResponse(repository.save(nota));
    }

    @Transactional
    public NotaRapidaResponseDTO actualizar(Long id, NotaRapidaRequestDTO dto) {
        NotaRapida nota = obtener(id);

        nota.setTitulo(dto.getTitulo().trim());
        nota.setDescripcion(dto.getDescripcion().trim());
        nota.setFechaAlerta(dto.getFechaAlerta());
        nota.setAlarma(Boolean.TRUE.equals(dto.getAlarma()));

        return toResponse(repository.save(nota));
    }

    @Transactional
    public NotaRapidaResponseDTO alternarCompletada(Long id) {
        NotaRapida nota = obtener(id);

        nota.setEstado(
                "COMPLETADA".equals(nota.getEstado())
                        ? "PENDIENTE"
                        : "COMPLETADA"
        );

        return toResponse(repository.save(nota));
    }

    @Transactional
    public void eliminar(Long id) {
        if (!repository.existsById(id)) {
            throw new RecursoNoEncontradoException("Nota rápida no encontrada");
        }

        repository.deleteById(id);
    }

    private NotaRapida obtener(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new RecursoNoEncontradoException(
                                "Nota rápida no encontrada"
                        )
                );
    }

    private NotaRapidaResponseDTO toResponse(NotaRapida nota) {
        return new NotaRapidaResponseDTO(
                nota.getId(),
                nota.getTitulo(),
                nota.getDescripcion(),
                nota.getFechaIngreso(),
                nota.getFechaAlerta(),
                nota.getAlarma(),
                nota.getEstado(),
                nota.getFechaActualizacion()
        );
    }
}
