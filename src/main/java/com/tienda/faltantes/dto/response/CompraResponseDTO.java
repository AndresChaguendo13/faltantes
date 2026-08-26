package com.tienda.faltantes.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public class CompraResponseDTO {

    private Long id;
    private String proveedor;
    private LocalDateTime fecha;
    private List<DetalleCompraResponseDTO> detalles;

    public CompraResponseDTO() {
    }

    public Long getId() {
        return id;
    }

    public String getProveedor() {
        return proveedor;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public List<DetalleCompraResponseDTO> getDetalles() {
        return detalles;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setProveedor(String proveedor) {
        this.proveedor = proveedor;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public void setDetalles(List<DetalleCompraResponseDTO> detalles) {
        this.detalles = detalles;
    }
}