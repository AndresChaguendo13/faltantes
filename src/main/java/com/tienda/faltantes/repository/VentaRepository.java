package com.tienda.faltantes.repository;

import com.tienda.faltantes.entity.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

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

    @Query(value = """
    SELECT COALESCE(SUM(total), 0)
    FROM ventas
    WHERE fecha >= :fechaInicio
    AND fecha <= :fechaFin
    """, nativeQuery = true)
    Double calcularTotalVentasEntre(
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin
    );

    @Query(value = """
    SELECT COALESCE(SUM(d.cantidad * d.costo_unitario), 0)
    FROM detalle_ventas d
    JOIN ventas v ON v.id = d.venta_id
    WHERE v.fecha >= :fechaInicio
    AND v.fecha <= :fechaFin
    AND d.costo_unitario IS NOT NULL
    """, nativeQuery = true)
    Double calcularCostoVentasEntre(
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin
    );

    @Query(value = """
    SELECT COALESCE(
        SUM(d.cantidad * (d.precio_unitario - d.costo_unitario)),
        0
    )
    FROM detalle_ventas d
    JOIN ventas v ON v.id = d.venta_id
    WHERE v.fecha >= :fechaInicio
    AND v.fecha <= :fechaFin
    AND d.costo_unitario IS NOT NULL
    """, nativeQuery = true)
    Double calcularUtilidadEntre(
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin
    );

    @Query(value = """
    SELECT
        p.id AS producto_id,
        p.nombre AS nombre_producto,

        SUM(d.cantidad) - COALESCE(
            (
                SELECT SUM(dv.cantidad)
                FROM devoluciones_venta dv
                WHERE dv.producto_id = p.id
                  AND dv.fecha >= :fechaInicio
                  AND dv.fecha <= :fechaFin
            ), 0
        ) AS unidades_vendidas,

        SUM(d.cantidad * d.precio_unitario) - COALESCE(
            (
                SELECT SUM(dv.valor)
                FROM devoluciones_venta dv
                WHERE dv.producto_id = p.id
                  AND dv.fecha >= :fechaInicio
                  AND dv.fecha <= :fechaFin
            ), 0
        ) AS total_ventas,

        SUM(d.cantidad * d.costo_unitario) - COALESCE(
            (
                SELECT SUM(dv.cantidad * p.costo_compra)
                FROM devoluciones_venta dv
                WHERE dv.producto_id = p.id
                  AND dv.fecha >= :fechaInicio
                  AND dv.fecha <= :fechaFin
            ), 0
        ) AS costo_ventas,

        (
            SUM(d.cantidad * d.precio_unitario) - COALESCE(
                (
                    SELECT SUM(dv.valor)
                    FROM devoluciones_venta dv
                    WHERE dv.producto_id = p.id
                      AND dv.fecha >= :fechaInicio
                      AND dv.fecha <= :fechaFin
                ), 0
            )
        )
        -
        (
            SUM(d.cantidad * d.costo_unitario) - COALESCE(
                (
                    SELECT SUM(dv.cantidad * p.costo_compra)
                    FROM devoluciones_venta dv
                    WHERE dv.producto_id = p.id
                      AND dv.fecha >= :fechaInicio
                      AND dv.fecha <= :fechaFin
                ), 0
            )
        ) AS utilidad_bruta

    FROM detalle_ventas d
    JOIN ventas v ON v.id = d.venta_id
    JOIN productos p ON p.id = d.producto_id

    WHERE v.fecha >= :fechaInicio
      AND v.fecha <= :fechaFin
      AND d.costo_unitario IS NOT NULL

    GROUP BY p.id, p.nombre
    ORDER BY utilidad_bruta DESC
    """, nativeQuery = true)
    List<Object[]> calcularUtilidadPorProducto(
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin
    );

    @Query(value = """
    SELECT COALESCE(SUM(dv.valor), 0)
    FROM devoluciones_venta dv
    WHERE dv.fecha >= :fechaInicio
      AND dv.fecha <= :fechaFin
    """, nativeQuery = true)
    Double calcularDevolucionesVentaEntre(
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin
    );

    @Query(value = """
    SELECT COALESCE(SUM(dv.cantidad * p.costo_compra), 0)
    FROM devoluciones_venta dv
    JOIN productos p ON p.id = dv.producto_id
    WHERE dv.fecha >= :fechaInicio
      AND dv.fecha <= :fechaFin
    """, nativeQuery = true)
    Double calcularCostoDevolucionesVentaEntre(
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin
    );

}