package com.tienda.faltantes.repository;

import com.tienda.faltantes.entity.DevolucionCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface DevolucionCompraRepository
        extends JpaRepository<DevolucionCompra, Long> {

    List<DevolucionCompra> findByCompraId(Long compraId);

    List<DevolucionCompra> findByProductoId(Long productoId);

    @Query("""
    SELECT COALESCE(SUM(d.valor), 0)
    FROM DevolucionCompra d
    WHERE d.fecha >= :fechaInicio
    AND d.fecha <= :fechaFin
""")
    Double calcularTotalEntre(
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin
    );

    @Query("""
    SELECT COALESCE(SUM(d.cantidad), 0)
    FROM DevolucionCompra d
    WHERE d.fecha >= :fechaInicio
    AND d.fecha <= :fechaFin
""")
    Long calcularCantidadEntre(
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin
    );

}