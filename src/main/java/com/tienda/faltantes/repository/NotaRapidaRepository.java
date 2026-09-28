package com.tienda.faltantes.repository;

import com.tienda.faltantes.entity.NotaRapida;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotaRapidaRepository extends JpaRepository<NotaRapida, Long> {

    List<NotaRapida> findAllByOrderByEstadoAscFechaActualizacionDesc();

}
