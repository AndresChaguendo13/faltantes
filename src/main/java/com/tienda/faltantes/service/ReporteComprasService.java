package com.tienda.faltantes.service;

import com.tienda.faltantes.dto.response.ReporteComprasResponseDTO;
import com.tienda.faltantes.repository.CompraRepository;
import org.springframework.stereotype.Service;
import com.tienda.faltantes.repository.DevolucionCompraRepository;
import java.time.LocalDateTime;

@Service
public class ReporteComprasService {

    private final CompraRepository compraRepository;
    private final DevolucionCompraRepository devolucionCompraRepository;

    public ReporteComprasService(CompraRepository compraRepository,
                                 DevolucionCompraRepository devolucionCompraRepository) {
        this.compraRepository = compraRepository;
        this.devolucionCompraRepository = devolucionCompraRepository;
    }

    public ReporteComprasResponseDTO obtenerReporte(
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin) {

        Double totalCompras =
                compraRepository.calcularTotalComprasEntre(
                        fechaInicio,
                        fechaFin);

        Double totalDevoluciones =
                devolucionCompraRepository.calcularTotalEntre(
                        fechaInicio,
                        fechaFin);

        Double comprasNetas =
                totalCompras - totalDevoluciones;



        ReporteComprasResponseDTO dto =
                new ReporteComprasResponseDTO();



        dto.setFechaInicio(fechaInicio);
        dto.setFechaFin(fechaFin);
        dto.setTotalCompras(totalCompras);
        dto.setTotalDevoluciones(totalDevoluciones);
        dto.setComprasNetas(comprasNetas);

        return dto;
    }
}