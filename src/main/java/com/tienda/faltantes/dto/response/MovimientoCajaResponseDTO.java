package com.tienda.faltantes.dto.response;

import com.tienda.faltantes.entity.TipoMovimientoCaja;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class MovimientoCajaResponseDTO {

    private Long id;
    private Long cajaId;
    private TipoMovimientoCaja tipo;
    private BigDecimal monto;
    private LocalDateTime fecha;
    private String motivo;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCajaId() {
        return cajaId;
    }

    public void setCajaId(Long cajaId) {
        this.cajaId = cajaId;
    }

    public TipoMovimientoCaja getTipo() {
        return tipo;
    }

    public void setTipo(TipoMovimientoCaja tipo) {
        this.tipo = tipo;
    }

    public BigDecimal getMonto() {
        return monto;
    }

    public void setMonto(BigDecimal monto) {
        this.monto = monto;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }
}