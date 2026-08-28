package com.tienda.faltantes.service;

import com.tienda.faltantes.dto.response.ReporteVentasResponseDTO;
import com.tienda.faltantes.repository.VentaRepository;
import org.springframework.stereotype.Service;
import com.tienda.faltantes.repository.DevolucionVentaRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class ReporteVentasService {

    private final VentaRepository ventaRepository;
    private final DevolucionVentaRepository devolucionVentaRepository;

    public ReporteVentasService(VentaRepository ventaRepository,
                                DevolucionVentaRepository devolucionVentaRepository) {
        this.ventaRepository = ventaRepository;
        this.devolucionVentaRepository = devolucionVentaRepository;
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

        BigDecimal totalDevolucionesDecimal =
                devolucionVentaRepository.calcularTotalEntre(
                        fechaInicio,
                        fechaFin);

        Double totalDevoluciones =
                totalDevolucionesDecimal.doubleValue();

        Double ventasNetas =
                totalVentas - totalDevoluciones;



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
        dto.setTotalDevoluciones(totalDevoluciones);
        dto.setVentasNetas(ventasNetas);


        return dto;
    }
}