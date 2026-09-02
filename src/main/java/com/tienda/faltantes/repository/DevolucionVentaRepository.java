package com.tienda.faltantes.repository;

import com.tienda.faltantes.entity.DevolucionVenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface DevolucionVentaRepository
        extends JpaRepository<DevolucionVenta, Long> {

    List<DevolucionVenta> findByVentaId(Long ventaId);

    List<DevolucionVenta> findByProductoId(Long productoId);

    @Query("""
        SELECT COALESCE(SUM(d.valor), 0)
        FROM DevolucionVenta d
        WHERE d.fecha >= :fechaInicio
        AND d.fecha <= :fechaFin
    """)
    BigDecimal calcularTotalEntre(
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin
    );

    @Query("""
    SELECT COALESCE(SUM(d.cantidad * d.producto.costoCompra), 0)
    FROM DevolucionVenta d
    WHERE d.fecha >= :fechaInicio
    AND d.fecha <= :fechaFin
""")
    Double calcularCostoDevolucionesEntre(
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin
    );

    @Query("""
    SELECT COALESCE(SUM(d.valor), 0)
    FROM DevolucionVenta d
    WHERE d.fecha >= :fechaInicio
    AND d.fecha <= :fechaFin
    AND d.venta.tipoPago = 'CONTADO'
""")
    BigDecimal calcularTotalContadoEntre(
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin
    );

    @Query("""
    SELECT COALESCE(SUM(d.cantidad), 0)
    FROM DevolucionVenta d
    WHERE d.fecha >= :fechaInicio
    AND d.fecha <= :fechaFin
""")
    Long calcularCantidadEntre(
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin
    );

}