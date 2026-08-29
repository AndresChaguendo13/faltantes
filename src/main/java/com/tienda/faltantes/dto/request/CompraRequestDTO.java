package com.tienda.faltantes.dto.request;

import jakarta.validation.constraints.NotNull;
import java.util.List;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public class CompraRequestDTO {

    @NotNull
    private Long proveedorId;

    @NotNull
    @Size(min = 1, message = "La compra debe tener al menos un detalle")
    @Valid
    private List<DetalleCompraRequestDTO> detalles;

    public CompraRequestDTO() {
    }

    public Long getProveedorId() {
        return proveedorId;
    }

    public void setProveedorId(Long proveedorId) {
        this.proveedorId = proveedorId;
    }

    public List<DetalleCompraRequestDTO> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetalleCompraRequestDTO> detalles) {
        this.detalles = detalles;
    }
}