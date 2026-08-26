package com.tienda.faltantes.repository;

import com.tienda.faltantes.entity.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface VentaRepository extends JpaRepository<Venta, Long> {

    @Query(value = """
        SELECT COALESCE(SUM(total), 0)
        FROM ventas
        WHERE fecha >= CURRENT_DATE
        AND fecha < CURRENT_DATE + INTERVAL '1 day'
        """, nativeQuery = true)
    Double calcularTotalVentasHoy();

    @Query(value = """
    SELECT COALESCE(SUM(total), 0)
    FROM ventas
    WHERE tipo_pago = 'CONTADO'
    AND fecha >= CURRENT_DATE
    AND fecha < CURRENT_DATE + INTERVAL '1 day'
    """, nativeQuery = true)
    Double calcularTotalContadoHoy();

    @Query(value = """
    SELECT COALESCE(SUM(total), 0)
    FROM ventas
    WHERE tipo_pago = 'FIADO'
    AND fecha >= CURRENT_DATE
    AND fecha < CURRENT_DATE + INTERVAL '1 day'
    """, nativeQuery = true)
    Double calcularTotalFiadoHoy();

    @Query(value = """
    SELECT COALESCE(SUM(total), 0)
    FROM ventas
    WHERE tipo_pago = 'CONTADO'
    AND fecha >= :fechaInicio
    AND fecha <= :fechaFin
    """, nativeQuery = true)
    Double calcularTotalContadoEntre(
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin
    );
}