package com.tienda.faltantes.repository;

import com.tienda.faltantes.entity.Proveedor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProveedorRepository extends JpaRepository<Proveedor, Long> {

    boolean existsByNit(String nit);

    Optional<Proveedor> findByNit(String nit);

}