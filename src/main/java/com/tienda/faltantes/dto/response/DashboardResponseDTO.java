package com.tienda.faltantes.dto.response;


import java.math.BigDecimal;

public class DashboardResponseDTO {

    private Long totalProductos;
    private Long productosStockBajo;
    private Long totalCompras;
    private Long totalVentas;
    private Double valorInventario;
    private Double ventasContadoHoy;
    private Double ventasFiadoHoy;
    private Double ventasHoy;
    private Double cuentasPorCobrar;
    private String estadoCaja;
    private BigDecimal montoInicialCaja;
    private BigDecimal ventasContadoCaja;
    private Long devolucionesVentaHoy;
    private Long devolucionesCompraHoy;
    private Double valorDevolucionesVentaHoy;
    private Double valorDevolucionesCompraHoy;
    private Double costoVentasHoy;
    private Double utilidadBrutaHoy;
    private Double margenUtilidadHoy;

    public Double getCostoVentasHoy() {
        return costoVentasHoy;
    }

    public void setCostoVentasHoy(Double costoVentasHoy) {
        this.costoVentasHoy = costoVentasHoy;
    }

    public Double getUtilidadBrutaHoy() {
        return utilidadBrutaHoy;
    }

    public void setUtilidadBrutaHoy(Double utilidadBrutaHoy) {
        this.utilidadBrutaHoy = utilidadBrutaHoy;
    }

    public Double getMargenUtilidadHoy() {
        return margenUtilidadHoy;
    }

    public void setMargenUtilidadHoy(Double margenUtilidadHoy) {
        this.margenUtilidadHoy = margenUtilidadHoy;
    }

    public Long getDevolucionesVentaHoy() {
        return devolucionesVentaHoy;
    }

    public void setDevolucionesVentaHoy(Long devolucionesVentaHoy) {
        this.devolucionesVentaHoy = devolucionesVentaHoy;
    }

    public Long getDevolucionesCompraHoy() {
        return devolucionesCompraHoy;
    }

    public void setDevolucionesCompraHoy(Long devolucionesCompraHoy) {
        this.devolucionesCompraHoy = devolucionesCompraHoy;
    }

    public Double getValorDevolucionesVentaHoy() {
        return valorDevolucionesVentaHoy;
    }

    public void setValorDevolucionesVentaHoy(Double valorDevolucionesVentaHoy) {
        this.valorDevolucionesVentaHoy = valorDevolucionesVentaHoy;
    }

    public Double getValorDevolucionesCompraHoy() {
        return valorDevolucionesCompraHoy;
    }

    public void setValorDevolucionesCompraHoy(Double valorDevolucionesCompraHoy) {
        this.valorDevolucionesCompraHoy = valorDevolucionesCompraHoy;
    }

    public String getEstadoCaja() {
        return estadoCaja;
    }

    public void setEstadoCaja(String estadoCaja) {
        this.estadoCaja = estadoCaja;
    }

    public BigDecimal getMontoInicialCaja() {
        return montoInicialCaja;
    }

    public void setMontoInicialCaja(BigDecimal montoInicialCaja) {
        this.montoInicialCaja = montoInicialCaja;
    }

    public BigDecimal getVentasContadoCaja() {
        return ventasContadoCaja;
    }

    public void setVentasContadoCaja(BigDecimal ventasContadoCaja) {
        this.ventasContadoCaja = ventasContadoCaja;
    }

    public BigDecimal getAbonosFiadosCaja() {
        return abonosFiadosCaja;
    }

    public void setAbonosFiadosCaja(BigDecimal abonosFiadosCaja) {
        this.abonosFiadosCaja = abonosFiadosCaja;
    }

    public BigDecimal getMontoEsperadoCaja() {
        return montoEsperadoCaja;
    }

    public void setMontoEsperadoCaja(BigDecimal montoEsperadoCaja) {
        this.montoEsperadoCaja = montoEsperadoCaja;
    }

    public BigDecimal getMontoFinalCaja() {
        return montoFinalCaja;
    }

    public void setMontoFinalCaja(BigDecimal montoFinalCaja) {
        this.montoFinalCaja = montoFinalCaja;
    }

    public BigDecimal getDiferenciaCaja() {
        return diferenciaCaja;
    }

    public void setDiferenciaCaja(BigDecimal diferenciaCaja) {
        this.diferenciaCaja = diferenciaCaja;
    }

    public String getResultadoCaja() {
        return resultadoCaja;
    }

    public void setResultadoCaja(String resultadoCaja) {
        this.resultadoCaja = resultadoCaja;
    }

    private BigDecimal abonosFiadosCaja;
    private BigDecimal montoEsperadoCaja;
    private BigDecimal montoFinalCaja;
    private BigDecimal diferenciaCaja;
    private String resultadoCaja;

    public Double getCuentasPorCobrar() {
        return cuentasPorCobrar;
    }

    public void setCuentasPorCobrar(Double cuentasPorCobrar) {
        this.cuentasPorCobrar = cuentasPorCobrar;
    }

    public Double getVentasHoy() {
        return ventasHoy;
    }

    public void setVentasHoy(Double ventasHoy) {
        this.ventasHoy = ventasHoy;
    }

    public Double getVentasContadoHoy() {
        return ventasContadoHoy;
    }

    public void setVentasContadoHoy(Double ventasContadoHoy) {
        this.ventasContadoHoy = ventasContadoHoy;
    }

    public Double getVentasFiadoHoy() {
        return ventasFiadoHoy;
    }

    public void setVentasFiadoHoy(Double ventasFiadoHoy) {
        this.ventasFiadoHoy = ventasFiadoHoy;
    }

    public DashboardResponseDTO() {
    }

    public Long getTotalProductos() {
        return totalProductos;
    }

    public void setTotalProductos(Long totalProductos) {
        this.totalProductos = totalProductos;
    }

    public Long getProductosStockBajo() {
        return productosStockBajo;
    }

    public void setProductosStockBajo(Long productosStockBajo) {
        this.productosStockBajo = productosStockBajo;
    }

    public Long getTotalCompras() {
        return totalCompras;
    }

    public void setTotalCompras(Long totalCompras) {
        this.totalCompras = totalCompras;
    }

    public Long getTotalVentas() {
        return totalVentas;
    }

    public void setTotalVentas(Long totalVentas) {
        this.totalVentas = totalVentas;
    }

    public Double getValorInventario() {
        return valorInventario;
    }

    public void setValorInventario(Double valorInventario) {
        this.valorInventario = valorInventario;
    }
}