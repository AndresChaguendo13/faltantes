package com.tienda.faltantes.repository;

import com.tienda.faltantes.entity.DevolucionVenta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DevolucionVentaRepository
        extends JpaRepository<DevolucionVenta, Long> {

    List<DevolucionVenta> findByVentaId(Long ventaId);

    List<DevolucionVenta> findByProductoId(Long productoId);
}