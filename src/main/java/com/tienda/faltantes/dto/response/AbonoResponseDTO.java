package com.tienda.faltantes.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AbonoResponseDTO {

    private Long id;
    private Long fiadoId;
    private BigDecimal valor;
    private LocalDateTime fecha;

    public AbonoResponseDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFiadoId() {
        return fiadoId;
    }

    public void setFiadoId(Long fiadoId) {
        this.fiadoId = fiadoId;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }
}