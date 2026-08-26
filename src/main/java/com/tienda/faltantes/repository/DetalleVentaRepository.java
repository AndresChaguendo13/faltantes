package com.tienda.faltantes.repository;

import com.tienda.faltantes.entity.DetalleVenta;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, Long> {
}