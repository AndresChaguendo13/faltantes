package com.tienda.faltantes.dto.response;

import java.math.BigDecimal;
import java.util.List;

public class EstadoCuentaResponseDTO {

    private Long clienteId;
    private String nombreCliente;
    private Integer totalFiados;
    private BigDecimal totalOriginal;
    private BigDecimal totalAbonado;
    private BigDecimal saldoPendiente;
    private List<FiadoResponseDTO> fiados;

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

    public Integer getTotalFiados() {
        return totalFiados;
    }

    public void setTotalFiados(Integer totalFiados) {
        this.totalFiados = totalFiados;
    }

    public BigDecimal getTotalOriginal() {
        return totalOriginal;
    }

    public void setTotalOriginal(BigDecimal totalOriginal) {
        this.totalOriginal = totalOriginal;
    }

    public BigDecimal getTotalAbonado() {
        return totalAbonado;
    }

    public void setTotalAbonado(BigDecimal totalAbonado) {
        this.totalAbonado = totalAbonado;
    }

    public BigDecimal getSaldoPendiente() {
        return saldoPendiente;
    }

    public void setSaldoPendiente(BigDecimal saldoPendiente) {
        this.saldoPendiente = saldoPendiente;
    }

    public List<FiadoResponseDTO> getFiados() {
        return fiados;
    }

    public void setFiados(List<FiadoResponseDTO> fiados) {
        this.fiados = fiados;
    }
}