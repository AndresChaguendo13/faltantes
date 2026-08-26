package com.tienda.faltantes.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class DetalleCompraRequestDTO {

    @NotNull
    private Long productoId;

    @NotNull
    @Min(1)
    private Integer cantidad;

    @NotNull
    @Min(1)
    private Double precioCompra;

    public DetalleCompraRequestDTO() {
    }

    public Long getProductoId() {
        return productoId;
    }

    public void setProductoId(Long productoId) {
        this.productoId = productoId;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public Double getPrecioCompra() {
        return precioCompra;
    }

    public void setPrecioCompra(Double precioCompra) {
        this.precioCompra = precioCompra;
    }
}