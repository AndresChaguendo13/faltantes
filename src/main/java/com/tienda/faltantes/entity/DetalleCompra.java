package com.tienda.faltantes.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "detalle_compras")
public class DetalleCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer cantidad;

    private Double precioCompra;

    private Double precioUnitario;

    @ManyToOne
    @JoinColumn(name = "producto_id")
    private Producto producto;

    @ManyToOne
    @JoinColumn(name = "compra_id")
    private Compra compra;

    public Double getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(Double precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    public DetalleCompra() {
    }

    public Long getId() {
        return id;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public Double getPrecioCompra() {
        return precioCompra;
    }

    public Producto getProducto() {
        return producto;
    }

    public Compra getCompra() {
        return compra;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public void setPrecioCompra(Double precioCompra) {
        this.precioCompra = precioCompra;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public void setCompra(Compra compra) {
        this.compra = compra;
    }
}