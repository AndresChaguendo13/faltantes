package com.tienda.faltantes.repository;

import com.tienda.faltantes.entity.DevolucionCompra;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DevolucionCompraRepository
        extends JpaRepository<DevolucionCompra, Long> {

    List<DevolucionCompra> findByCompraId(Long compraId);

    List<DevolucionCompra> findByProductoId(Long productoId);
}