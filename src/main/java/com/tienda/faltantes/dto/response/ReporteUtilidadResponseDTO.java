package com.tienda.faltantes.dto.response;

import java.time.LocalDateTime;

public class ReporteUtilidadResponseDTO {

    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;

    private Double totalVentas;
    private Double costoVentas;
    private Double utilidadBruta;
    private Double margenUtilidad;

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