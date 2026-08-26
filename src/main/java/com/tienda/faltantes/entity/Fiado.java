package com.tienda.faltantes.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.tienda.faltantes.entity.Venta;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;



@Entity
@Table(name = "fiados")
public class Fiado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venta_id")
    private Venta venta;

    public Venta getVenta() {
        return venta;
    }

    public void setVenta(Venta venta) {
        this.venta = venta;
    }

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal valorOriginal;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal valorAbonado = BigDecimal.ZERO;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal saldoPendiente;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoFiado estado;

    @Column(nullable = false)
    private LocalDateTime fecha;

    public Fiado() {
    }

    @PrePersist
    public void prePersist() {
        if (fecha == null) {
            fecha = LocalDateTime.now();
        }

        if (valorAbonado == null) {
            valorAbonado = BigDecimal.ZERO;
        }

        if (saldoPendiente == null && valorOriginal != null) {
            saldoPendiente = valorOriginal.subtract(valorAbonado);
        }

        if (estado == null) {
            estado = saldoPendiente != null
                    && saldoPendiente.compareTo(BigDecimal.ZERO) == 0
                    ? EstadoFiado.PAGADO
                    : EstadoFiado.PENDIENTE;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
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

    public EstadoFiado getEstado() {
        return estado;
    }

    public void setEstado(EstadoFiado estado) {
        this.estado = estado;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }
}