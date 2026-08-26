package com.tienda.faltantes.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class CajaCierreRequestDTO {

    @NotNull
    @DecimalMin(value = "0.00")
    private BigDecimal montoFinal;

    public BigDecimal getMontoFinal() {
        return montoFinal;
    }

    public void setMontoFinal(BigDecimal montoFinal) {
        this.montoFinal = montoFinal;
    }
}