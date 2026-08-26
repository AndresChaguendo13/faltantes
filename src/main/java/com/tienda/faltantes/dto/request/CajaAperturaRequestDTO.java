package com.tienda.faltantes.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class CajaAperturaRequestDTO {

    @NotNull
    @DecimalMin(value = "0.00")
    private BigDecimal montoInicial;

    public BigDecimal getMontoInicial() {
        return montoInicial;
    }

    public void setMontoInicial(BigDecimal montoInicial) {
        this.montoInicial = montoInicial;
    }
}