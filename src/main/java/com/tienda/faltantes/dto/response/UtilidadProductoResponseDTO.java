package com.tienda.faltantes.dto.response;

public class UtilidadProductoResponseDTO {

    private Long productoId;
    private String nombreProducto;

    private Integer unidadesVendidas;
    private Double totalVentas;
    private Double costoVentas;
    private Double utilidadBruta;
    private Double margenUtilidad;

    public Long getProductoId() {
        return productoId;
    }

    public void setProductoId(Long productoId) {
        this.productoId = productoId;
    }

    public String getNombreProducto() {
        return nombreProducto;
    }

    public void setNombreProducto(String nombreProducto) {
        this.nombreProducto = nombreProducto;
    }

    public Integer getUnidadesVendidas() {
        return unidadesVendidas;
    }

    public void setUnidadesVendidas(Integer unidadesVendidas) {
        this.unidadesVendidas = unidadesVendidas;
    }

    public Double getTotalVentas() {
        return totalVentas;
    }

    public void setTotalVentas(Double totalVentas) {
        this.totalVentas = totalVentas;
    }

    public Double getCostoVentas() {
        return costoVentas;
    }

    public void setCostoVentas(Double costoVentas) {
        this.costoVentas = costoVentas;
    }

    public Double getUtilidadBruta() {
        return utilidadBruta;
    }

    public void setUtilidadBruta(Double utilidadBruta) {
        this.utilidadBruta = utilidadBruta;
    }

    public Double getMargenUtilidad() {
        return margenUtilidad;
    }

    public void setMargenUtilidad(Double margenUtilidad) {
        this.margenUtilidad = margenUtilidad;
    }
}