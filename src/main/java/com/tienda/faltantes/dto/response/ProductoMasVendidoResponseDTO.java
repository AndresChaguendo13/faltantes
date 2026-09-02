package com.tienda.faltantes.dto.response;

public class ProductoMasVendidoResponseDTO {

    private Long productoId;
    private String nombreProducto;
    private Long unidadesVendidas;

    public ProductoMasVendidoResponseDTO() {
    }

    public ProductoMasVendidoResponseDTO(
            Long productoId,
            String nombreProducto,
            Long unidadesVendidas) {

        this.productoId = productoId;
        this.nombreProducto = nombreProducto;
        this.unidadesVendidas = unidadesVendidas;
    }

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

    public Long getUnidadesVendidas() {
        return unidadesVendidas;
    }

    public void setUnidadesVendidas(Long unidadesVendidas) {
        this.unidadesVendidas = unidadesVendidas;
    }
}