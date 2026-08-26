package com.tienda.faltantes.repository;

import com.tienda.faltantes.entity.Abono;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface AbonoRepository extends JpaRepository<Abono, Long> {

    List<Abono> findByFiadoIdOrderByFechaDesc(Long fiadoId);


    @Query(value = """
    SELECT COALESCE(SUM(valor), 0)
    FROM abonos
    WHERE fecha >= CURRENT_DATE
    AND fecha < CURRENT_DATE + INTERVAL '1 day'
    """, nativeQuery = true)
    BigDecimal calcularTotalAbonosHoy();

    @Query(value = """
    SELECT COALESCE(SUM(valor), 0)
    FROM abonos
    WHERE fecha >= :fechaInicio
    AND fecha <= :fechaFin
    """, nativeQuery = true)
    BigDecimal calcularTotalAbonosEntre(
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin
    );
}