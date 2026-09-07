package com.tienda.faltantes.dto.request;

import com.tienda.faltantes.entity.TipoMovimientoCaja;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class MovimientoCajaRequestDTO {

    @NotNull
    private TipoMovimientoCaja tipo;

    @NotNull
    @DecimalMin(value = "0.01")
    private BigDecimal monto;

    @NotBlank
    private String motivo;

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

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }
}