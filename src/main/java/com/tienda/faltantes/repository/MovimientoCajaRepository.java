package com.tienda.faltantes.repository;

import com.tienda.faltantes.entity.MovimientoCaja;
import com.tienda.faltantes.entity.TipoMovimientoCaja;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface MovimientoCajaRepository extends JpaRepository<MovimientoCaja, Long> {

    List<MovimientoCaja> findByCajaIdOrderByFechaDesc(Long cajaId);

    @Query("""
        SELECT COALESCE(SUM(m.monto), 0)
        FROM MovimientoCaja m
        WHERE m.caja.id = :cajaId
        AND m.tipo = :tipo
        AND m.fecha >= :fechaInicio
        AND m.fecha <= :fechaFin
        """)
    BigDecimal calcularTotalPorTipo(
            @Param("cajaId") Long cajaId,
            @Param("tipo") TipoMovimientoCaja tipo,
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin
    );
}