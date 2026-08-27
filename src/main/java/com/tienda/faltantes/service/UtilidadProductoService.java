package com.tienda.faltantes.service;

import com.tienda.faltantes.dto.response.UtilidadProductoResponseDTO;
import com.tienda.faltantes.repository.VentaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class UtilidadProductoService {

    private final VentaRepository ventaRepository;

    public UtilidadProductoService(VentaRepository ventaRepository) {
        this.ventaRepository = ventaRepository;
    }

    public List<UtilidadProductoResponseDTO> obtenerUtilidadPorProducto(
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin) {

        List<Object[]> resultados =
                ventaRepository.calcularUtilidadPorProducto(
                        fechaInicio,
                        fechaFin
                );

        List<UtilidadProductoResponseDTO> respuesta = new ArrayList<>();

        for (Object[] fila : resultados) {

            Long productoId = ((Number) fila[0]).longValue();
            String nombreProducto = (String) fila[1];

            Integer unidadesVendidas =
                    ((Number) fila[2]).intValue();

            Double totalVentas =
                    ((Number) fila[3]).doubleValue();

            Double costoVentas =
                    ((Number) fila[4]).doubleValue();

            Double utilidadBruta =
                    ((Number) fila[5]).doubleValue();

            Double margenUtilidad = 0.0;

            if (totalVentas > 0) {
                margenUtilidad =
                        (utilidadBruta / totalVentas) * 100;
            }

            UtilidadProductoResponseDTO dto =
                    new UtilidadProductoResponseDTO();

            dto.setProductoId(productoId);
            dto.setNombreProducto(nombreProducto);
            dto.setUnidadesVendidas(unidadesVendidas);
            dto.setTotalVentas(totalVentas);
            dto.setCostoVentas(costoVentas);
            dto.setUtilidadBruta(utilidadBruta);
            dto.setMargenUtilidad(margenUtilidad);

            respuesta.add(dto);
        }

        return respuesta;
    }
}