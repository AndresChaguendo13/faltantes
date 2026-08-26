package com.tienda.faltantes.repository;

import com.tienda.faltantes.entity.Fiado;
import org.springframework.data.jpa.repository.JpaRepository;
import com.tienda.faltantes.entity.EstadoFiado;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

import java.util.List;
import java.util.Optional;

public interface FiadoRepository extends JpaRepository<Fiado, Long> {

    List<Fiado> findByClienteId(Long clienteId);

    List<Fiado> findByClienteIdAndEstado(
            Long clienteId,
            com.tienda.faltantes.entity.EstadoFiado estado);

    @Query("""
       SELECT COALESCE(SUM(f.saldoPendiente), 0)
       FROM Fiado f
       WHERE f.cliente.id = :clienteId
       AND f.estado = :estado
       """)
    BigDecimal calcularSaldoCliente(
            @Param("clienteId") Long clienteId,
            @Param("estado") EstadoFiado estado);

    @Query("""
    SELECT COALESCE(SUM(f.saldoPendiente), 0)
    FROM Fiado f
    WHERE f.estado = :estado
    """)
    BigDecimal calcularSaldoTotal(
            @Param("estado") EstadoFiado estado);

    Optional<Fiado> findByVentaId(Long ventaId);

}