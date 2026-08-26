package com.tienda.faltantes.repository;

import com.tienda.faltantes.entity.Compra;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompraRepository extends JpaRepository<Compra, Long> {
}