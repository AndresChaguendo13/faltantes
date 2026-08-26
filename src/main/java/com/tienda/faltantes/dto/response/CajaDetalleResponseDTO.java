package com.tienda.faltantes.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CajaDetalleResponseDTO {

    private Long id;
    private LocalDateTime fechaApertura;
    private LocalDateTime fechaCierre;
    private BigDecimal montoInicial;
    private BigDecimal ventasContado;
    private BigDecimal abonosFiados;
    private BigDecimal montoEsperado;
    private BigDecimal montoFinal;
    private BigDecimal diferencia;
    private String estado;
    private String resultado;

    public String getResultado() {
        return resultado;
    }

    public void setResultado(String resultado) {
        this.resultado = resultado;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getFechaApertura() {
        return fechaApertura;
    }

    public void setFechaApertura(LocalDateTime fechaApertura) {
        this.fechaApertura = fechaApertura;
    }

    public LocalDateTime getFechaCierre() {
        return fechaCierre;
    }

    public void setFechaCierre(LocalDateTime fechaCierre) {
        this.fechaCierre = fechaCierre;
    }

    public BigDecimal getMontoInicial() {
        return montoInicial;
    }

    public void setMontoInicial(BigDecimal montoInicial) {
        this.montoInicial = montoInicial;
    }

    public BigDecimal getVentasContado() {
        return ventasContado;
    }

    public void setVentasContado(BigDecimal ventasContado) {
        this.ventasContado = ventasContado;
    }

    public BigDecimal getAbonosFiados() {
        return abonosFiados;
    }

    public void setAbonosFiados(BigDecimal abonosFiados) {
        this.abonosFiados = abonosFiados;
    }

    public BigDecimal getMontoEsperado() {
        return montoEsperado;
    }

    public void setMontoEsperado(BigDecimal montoEsperado) {
        this.montoEsperado = montoEsperado;
    }

    public BigDecimal getMontoFinal() {
        return montoFinal;
    }

    public void setMontoFinal(BigDecimal montoFinal) {
        this.montoFinal = montoFinal;
    }

    public BigDecimal getDiferencia() {
        return diferencia;
    }

    public void setDiferencia(BigDecimal diferencia) {
        this.diferencia = diferencia;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}