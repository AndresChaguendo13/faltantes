package com.tienda.faltantes.dto.response;

import java.math.BigDecimal;

public class CajaResponseDTO {

    private BigDecimal ventasContado;
    private BigDecimal ventasFiado;
    private BigDecimal abonosFiados;
    private BigDecimal totalRecibido;

    public BigDecimal getVentasContado() {
        return ventasContado;
    }

    public void setVentasContado(BigDecimal ventasContado) {
        this.ventasContado = ventasContado;
    }

    public BigDecimal getVentasFiado() {
        return ventasFiado;
    }

    public void setVentasFiado(BigDecimal ventasFiado) {
        this.ventasFiado = ventasFiado;
    }

    public BigDecimal getAbonosFiados() {
        return abonosFiados;
    }

    public void setAbonosFiados(BigDecimal abonosFiados) {
        this.abonosFiados = abonosFiados;
    }

    public BigDecimal getTotalRecibido() {
        return totalRecibido;
    }

    public void setTotalRecibido(BigDecimal totalRecibido) {
        this.totalRecibido = totalRecibido;
    }
}