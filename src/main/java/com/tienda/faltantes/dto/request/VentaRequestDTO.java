package com.tienda.faltantes.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class VentaRequestDTO {

    @NotEmpty
    @Valid
    private List<DetalleVentaRequestDTO> detalles;
    private Long clienteId;

    private String tipoPago;

    public List<DetalleVentaRequestDTO> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetalleVentaRequestDTO> detalles) {
        this.detalles = detalles;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public String getTipoPago() {
        return tipoPago;
    }

    public void setTipoPago(String tipoPago) {
        this.tipoPago = tipoPago;
    }
}