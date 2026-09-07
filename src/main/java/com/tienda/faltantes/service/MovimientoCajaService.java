package com.tienda.faltantes.service;

import com.tienda.faltantes.dto.request.MovimientoCajaRequestDTO;
import com.tienda.faltantes.dto.response.MovimientoCajaResponseDTO;
import com.tienda.faltantes.entity.Caja;
import com.tienda.faltantes.entity.EstadoCaja;
import com.tienda.faltantes.entity.MovimientoCaja;
import com.tienda.faltantes.repository.CajaRepository;
import com.tienda.faltantes.repository.MovimientoCajaRepository;
import com.tienda.faltantes.exception.CajaNoAbiertaException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovimientoCajaService {

    private final MovimientoCajaRepository movimientoCajaRepository;
    private final CajaRepository cajaRepository;

    public MovimientoCajaService(
            MovimientoCajaRepository movimientoCajaRepository,
            CajaRepository cajaRepository) {

        this.movimientoCajaRepository = movimientoCajaRepository;
        this.cajaRepository = cajaRepository;
    }

    @Transactional
    public MovimientoCajaResponseDTO registrar(MovimientoCajaRequestDTO request) {

        Caja caja = cajaRepository.findByEstado(EstadoCaja.ABIERTA)
                .orElseThrow(() ->
                        new CajaNoAbiertaException(
                                "No hay ninguna caja abierta"
                        ));

        MovimientoCaja movimiento = new MovimientoCaja();

        movimiento.setCaja(caja);
        movimiento.setTipo(request.getTipo());
        movimiento.setMonto(request.getMonto());
        movimiento.setMotivo(request.getMotivo());

        movimiento = movimientoCajaRepository.save(movimiento);

        return convertirAResponse(movimiento);
    }

    public List<MovimientoCajaResponseDTO> listarPorCaja(Long cajaId) {

        return movimientoCajaRepository
                .findByCajaIdOrderByFechaDesc(cajaId)
                .stream()
                .map(this::convertirAResponse)
                .toList();
    }

    private MovimientoCajaResponseDTO convertirAResponse(
            MovimientoCaja movimiento) {

        MovimientoCajaResponseDTO dto =
                new MovimientoCajaResponseDTO();

        dto.setId(movimiento.getId());
        dto.setCajaId(movimiento.getCaja().getId());
        dto.setTipo(movimiento.getTipo());
        dto.setMonto(movimiento.getMonto());
        dto.setFecha(movimiento.getFecha());
        dto.setMotivo(movimiento.getMotivo());

        return dto;
    }
}