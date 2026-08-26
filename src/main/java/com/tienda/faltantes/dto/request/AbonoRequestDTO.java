package com.tienda.faltantes.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class AbonoRequestDTO {

    @NotNull(message = "El valor del abono es obligatorio")
    @DecimalMin(value = "0.01", message = "El abono debe ser mayor que cero")
    private BigDecimal valor;

    public AbonoRequestDTO() {
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }
}