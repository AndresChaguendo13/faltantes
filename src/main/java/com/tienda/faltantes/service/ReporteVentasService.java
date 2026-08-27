package com.tienda.faltantes.service;

import com.tienda.faltantes.dto.response.ReporteVentasResponseDTO;
import com.tienda.faltantes.repository.VentaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ReporteVentasService {

    private final VentaRepository ventaRepository;

    public ReporteVentasService(VentaRepository ventaRepository) {
        this.ventaRepository = ventaRepository;
    }

    public ReporteVentasResponseDTO obtenerReporte(
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin) {

        ReporteVentasResponseDTO dto =
                new ReporteVentasResponseDTO();

        Double totalVentas =
                ventaRepository.calcularTotalVentasEntre(
                        fechaInicio,
                        fechaFin);

        Double totalContado =
                ventaRepository.calcularTotalContadoEntre(
                        fechaInicio,
                        fechaFin);

        Double totalFiado = totalVentas - totalContado;

        dto.setFechaInicio(fechaInicio);
        dto.setFechaFin(fechaFin);
        dto.setTotalVentas(totalVentas);
        dto.setTotalVentasContado(totalContado);
        dto.setTotalVentasFiado(totalFiado);

        return dto;
    }
}