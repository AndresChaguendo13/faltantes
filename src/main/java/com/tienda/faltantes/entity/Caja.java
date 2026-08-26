package com.tienda.faltantes.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cajas")
public class Caja {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime fechaApertura;

    private LocalDateTime fechaCierre;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal montoInicial;

    @Column(precision = 12, scale = 2)
    private BigDecimal montoFinal;

    @Column(precision = 12, scale = 2)
    private BigDecimal montoEsperado;

    @Column(precision = 12, scale = 2)
    private BigDecimal diferencia;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoCaja estado;

    // GETTERS Y SETTERS

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

    public BigDecimal getMontoFinal() {
        return montoFinal;
    }

    public void setMontoFinal(BigDecimal montoFinal) {
        this.montoFinal = montoFinal;
    }

    public BigDecimal getMontoEsperado() {
        return montoEsperado;
    }

    public void setMontoEsperado(BigDecimal montoEsperado) {
        this.montoEsperado = montoEsperado;
    }

    public BigDecimal getDiferencia() {
        return diferencia;
    }

    public void setDiferencia(BigDecimal diferencia) {
        this.diferencia = diferencia;
    }

    public EstadoCaja getEstado() {
        return estado;
    }

    public void setEstado(EstadoCaja estado) {
        this.estado = estado;
    }
}