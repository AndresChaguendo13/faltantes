package com.tienda.faltantes.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class FiadoResponseDTO {

    private Long id;

    private Long clienteId;

    private String nombreCliente;

    private BigDecimal valorOriginal;

    private BigDecimal valorAbonado;

    private BigDecimal saldoPendiente;

    private String estado;

    private LocalDateTime fecha;

    private Long ventaId;

    public FiadoResponseDTO() {
    }


    public Long getVentaId() {
        return ventaId;
    }

    public void setVentaId(Long ventaId) {
        this.ventaId = ventaId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public BigDecimal getValorOriginal() {
        return valorOriginal;
    }

    public void setValorOriginal(BigDecimal valorOriginal) {
        this.valorOriginal = valorOriginal;
    }

    public BigDecimal getValorAbonado() {
        return valorAbonado;
    }

    public void setValorAbonado(BigDecimal valorAbonado) {
        this.valorAbonado = valorAbonado;
    }

    public BigDecimal getSaldoPendiente() {
        return saldoPendiente;
    }

    public void setSaldoPendiente(BigDecimal saldoPendiente) {
        this.saldoPendiente = saldoPendiente;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }
}