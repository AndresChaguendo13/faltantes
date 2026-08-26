package com.tienda.faltantes.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class FiadoRequestDTO {

    @NotNull(message = "El cliente es obligatorio")
    private Long clienteId;

    @NotNull(message = "El valor original es obligatorio")
    @DecimalMin(value = "0.01", message = "El valor debe ser mayor que cero")
    private BigDecimal valorOriginal;

    public FiadoRequestDTO() {
    }

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public BigDecimal getValorOriginal() {
        return valorOriginal;
    }

    public void setValorOriginal(BigDecimal valorOriginal) {
        this.valorOriginal = valorOriginal;
    }
}