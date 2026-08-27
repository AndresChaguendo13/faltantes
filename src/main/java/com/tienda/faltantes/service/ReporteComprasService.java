package com.tienda.faltantes.service;

import com.tienda.faltantes.dto.response.ReporteComprasResponseDTO;
import com.tienda.faltantes.repository.CompraRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ReporteComprasService {

    private final CompraRepository compraRepository;

    public ReporteComprasService(CompraRepository compraRepository) {
        this.compraRepository = compraRepository;
    }

    public ReporteComprasResponseDTO obtenerReporte(
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin) {

        Double totalCompras =
                compraRepository.calcularTotalComprasEntre(
                        fechaInicio,
                        fechaFin);

        ReporteComprasResponseDTO dto =
                new ReporteComprasResponseDTO();

        dto.setFechaInicio(fechaInicio);
        dto.setFechaFin(fechaFin);
        dto.setTotalCompras(totalCompras);

        return dto;
    }
}