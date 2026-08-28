package com.tienda.faltantes.service;

import com.tienda.faltantes.dto.response.ReporteUtilidadResponseDTO;
import com.tienda.faltantes.repository.VentaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ReporteUtilidadService {

    private final VentaRepository ventaRepository;

    public ReporteUtilidadService(VentaRepository ventaRepository) {
        this.ventaRepository = ventaRepository;
    }

    public ReporteUtilidadResponseDTO obtenerReporte(
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin) {

        Double ventasBrutas =
                ventaRepository.calcularTotalVentasEntre(fechaInicio, fechaFin);

        Double devoluciones =
                ventaRepository.calcularDevolucionesVentaEntre(fechaInicio, fechaFin);

        Double totalVentas = ventasBrutas - devoluciones;

        Double costoVentasBruto =
                ventaRepository.calcularCostoVentasEntre(fechaInicio, fechaFin);

        Double costoDevoluciones =
                ventaRepository.calcularCostoDevolucionesVentaEntre(
                        fechaInicio,
                        fechaFin
                );

        Double costoVentas = costoVentasBruto - costoDevoluciones;

        Double utilidadBruta = totalVentas - costoVentas;

        Double margenUtilidad = 0.0;

        if (totalVentas != null && totalVentas > 0) {
            margenUtilidad = (utilidadBruta / totalVentas) * 100;
        }

        ReporteUtilidadResponseDTO response =
                new ReporteUtilidadResponseDTO();

        response.setFechaInicio(fechaInicio);
        response.setFechaFin(fechaFin);
        response.setTotalVentas(totalVentas);
        response.setCostoVentas(costoVentas);
        response.setUtilidadBruta(utilidadBruta);
        response.setMargenUtilidad(margenUtilidad);

        return response;
    }
}