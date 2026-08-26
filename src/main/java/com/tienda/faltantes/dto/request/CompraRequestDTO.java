package com.tienda.faltantes.dto.request;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public class CompraRequestDTO {

    @NotNull
    private Long proveedorId;

    @NotNull
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