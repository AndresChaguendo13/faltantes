package com.tienda.faltantes.service;

import com.tienda.faltantes.dto.request.AbonoRequestDTO;
import com.tienda.faltantes.dto.response.AbonoResponseDTO;
import com.tienda.faltantes.entity.Abono;
import com.tienda.faltantes.entity.EstadoFiado;
import com.tienda.faltantes.entity.Fiado;
import com.tienda.faltantes.exception.RecursoNoEncontradoException;
import com.tienda.faltantes.mapper.AbonoMapper;
import com.tienda.faltantes.repository.AbonoRepository;
import com.tienda.faltantes.repository.FiadoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AbonoService {

    private final AbonoRepository abonoRepository;
    private final FiadoRepository fiadoRepository;
    private final AbonoMapper mapper;

    public AbonoService(AbonoRepository abonoRepository,
                        FiadoRepository fiadoRepository,
                        AbonoMapper mapper) {

        this.abonoRepository = abonoRepository;
        this.fiadoRepository = fiadoRepository;
        this.mapper = mapper;
    }

    @Transactional
    public AbonoResponseDTO registrarAbono(
            Long fiadoId,
            AbonoRequestDTO dto) {

        Fiado fiado = fiadoRepository.findById(fiadoId)
                .orElseThrow(() ->
                        new RecursoNoEncontradoException(
                                "Fiado no encontrado"
                        ));

        if (fiado.getEstado() == EstadoFiado.PAGADO) {
            throw new IllegalStateException(
                    "Este fiado ya está completamente pagado"
            );
        }

        BigDecimal valorAbono = dto.getValor();

        if (valorAbono.compareTo(fiado.getSaldoPendiente()) > 0) {
            throw new IllegalArgumentException(
                    "El abono no puede ser mayor que el saldo pendiente"
            );
        }

        Abono abono = new Abono();

        abono.setFiado(fiado);
        abono.setValor(valorAbono);

        Abono guardado = abonoRepository.save(abono);

        BigDecimal nuevoValorAbonado =
                fiado.getValorAbonado().add(valorAbono);

        BigDecimal nuevoSaldo =
                fiado.getSaldoPendiente().subtract(valorAbono);

        fiado.setValorAbonado(nuevoValorAbonado);
        fiado.setSaldoPendiente(nuevoSaldo);

        if (nuevoSaldo.compareTo(BigDecimal.ZERO) == 0) {
            fiado.setEstado(EstadoFiado.PAGADO);
        }

        fiadoRepository.save(fiado);

        return mapper.toResponseDTO(guardado);
    }

    public List<AbonoResponseDTO> listarPorFiado(Long fiadoId) {

        if (!fiadoRepository.existsById(fiadoId)) {
            throw new RecursoNoEncontradoException(
                    "Fiado no encontrado"
            );
        }

        return abonoRepository
                .findByFiadoIdOrderByFechaDesc(fiadoId)
                .stream()
                .map(mapper::toResponseDTO)
                .toList();
    }
}