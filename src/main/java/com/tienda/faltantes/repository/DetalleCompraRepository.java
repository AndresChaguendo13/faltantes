package com.tienda.faltantes.repository;

import com.tienda.faltantes.entity.DetalleCompra;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DetalleCompraRepository extends JpaRepository<DetalleCompra, Long> {
}