package com.tienda.faltantes.repository;

import com.tienda.faltantes.entity.MovimientoInventario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovimientoInventarioRepository
        extends JpaRepository<MovimientoInventario, Long> {

}