package com.tienda.faltantes.repository;

import com.tienda.faltantes.entity.Compra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface CompraRepository extends JpaRepository<Compra, Long> {

    @Query(value = """
    SELECT COALESCE(SUM(d.cantidad * d.precio_unitario), 0)
    FROM compras c
    JOIN detalle_compras d ON d.compra_id = c.id
    WHERE c.fecha >= :fechaInicio
    AND c.fecha <= :fechaFin
    """, nativeQuery = true)
    Double calcularTotalComprasEntre(
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin
    );
}