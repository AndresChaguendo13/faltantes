package com.tienda.faltantes.dto.response;

public class DetalleCompraResponseDTO {

    private String producto;
    private Integer cantidad;
    private Double precioCompra;

    public DetalleCompraResponseDTO() {
    }

    public String getProducto() {
        return producto;
    }

    public void setProducto(String producto) {
        this.producto = producto;
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