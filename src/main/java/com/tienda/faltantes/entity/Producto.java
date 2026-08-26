package com.tienda.faltantes.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

import jakarta.persistence.ManyToOne;

import jakarta.persistence.JoinColumn;

@Entity
@Table(name = "productos")
public class Producto {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(unique = true, nullable = false)
    private String codigoBarras;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(nullable = false)
    private Double precio;


    @Column(nullable = false)
    private Integer stockMinimo;

    @Column(nullable = false)
    private Double costoCompra;

    @Column(nullable = false)
    private Double precioVenta;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    private String proveedor;

    private LocalDate fechaVencimiento;


    public Producto() {
    }

    public Producto(Long id, String nombre, String codigoBarras, Integer cantidad, Double precio) {
        this.id = id;
        this.nombre = nombre;
        this.codigoBarras = codigoBarras;
        this.cantidad = cantidad;
        this.precio = precio;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCodigoBarras() {
        return codigoBarras;
    }

    public void setCodigoBarras(String codigoBarras) {
        this.codigoBarras = codigoBarras;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public Double getPrecio() {
        return precio;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public Integer getStockMinimo() {
        return stockMinimo;
    }

    public void setStockMinimo(Integer stockMinimo) {
        this.stockMinimo = stockMinimo;
    }

    public Double getCostoCompra() {
        return costoCompra;
    }

    public void setCostoCompra(Double costoCompra) {
        this.costoCompra = costoCompra;
    }

    public Double getPrecioVenta() {
        return precioVenta;
    }

    public void setPrecioVenta(Double precioVenta) {
        this.precioVenta = precioVenta;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public String getProveedor() {
        return proveedor;
    }

    public void setProveedor(String proveedor) {
        this.proveedor = proveedor;
    }

    public LocalDate getFechaVencimiento() {
        return fechaVencimiento;
    }

    public void setFechaVencimiento(LocalDate fechaVencimiento) {
        this.fechaVencimiento = fechaVencimiento;
    }

}