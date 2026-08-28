package com.tienda.faltantes.dto.response;

import java.time.LocalDateTime;

public class ReporteVentasResponseDTO {

    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private Double totalVentas;
    private Double totalVentasContado;
    private Double totalVentasFiado;
    private Double totalDevoluciones;
    private Double ventasNetas;

    public Double getTotalDevoluciones() {
        return totalDevoluciones;
    }

    public void setTotalDevoluciones(Double totalDevoluciones) {
        this.totalDevoluciones = totalDevoluciones;
    }

    public Double getVentasNetas() {
        return ventasNetas;
    }

    public void setVentasNetas(Double ventasNetas) {
        this.ventasNetas = ventasNetas;
    }

    public LocalDateTime getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDateTime fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDateTime getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDateTime fechaFin) {
        this.fechaFin = fechaFin;
    }

    public Double getTotalVentas() {
        return totalVentas;
    }

    public void setTotalVentas(Double totalVentas) {
        this.totalVentas = totalVentas;
    }

    public Double getTotalVentasContado() {
        return totalVentasContado;
    }

    public void setTotalVentasContado(Double totalVentasContado) {
        this.totalVentasContado = totalVentasContado;
    }

    public Double getTotalVentasFiado() {
        return totalVentasFiado;
    }

    public void setTotalVentasFiado(Double totalVentasFiado) {
        this.totalVentasFiado = totalVentasFiado;
    }
}