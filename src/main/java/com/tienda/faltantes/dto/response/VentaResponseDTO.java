package com.tienda.faltantes.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public class VentaResponseDTO {

    private Long id;
    private LocalDateTime fecha;
    private Double total;
    private List<DetalleVentaResponseDTO> detalles;
    private String tipoPago;
    private Long clienteId;
    private String nombreCliente;
    private Long fiadoId;

    public Long getFiadoId() {
        return fiadoId;
    }

    public void setFiadoId(Long fiadoId) {
        this.fiadoId = fiadoId;
    }

    public String getTipoPago() {
        return tipoPago;
    }

    public void setTipoPago(String tipoPago) {
        this.tipoPago = tipoPago;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public String getNombreCliente() {
        return nombreCliente;
    }

    public void setNombreCliente(String nombreCliente) {
        this.nombreCliente = nombreCliente;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public List<DetalleVentaResponseDTO> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetalleVentaResponseDTO> detalles) {
        this.detalles = detalles;
    }
}