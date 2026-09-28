package com.tienda.faltantes.dto.response;

import java.time.LocalDateTime;

public class NotaRapidaResponseDTO {

    private Long id;
    private String titulo;
    private String descripcion;
    private LocalDateTime fechaIngreso;
    private LocalDateTime fechaAlerta;
    private Boolean alarma;
    private String estado;
    private LocalDateTime fechaActualizacion;

    public NotaRapidaResponseDTO() {
    }

    public NotaRapidaResponseDTO(
            Long id,
            String titulo,
            String descripcion,
            LocalDateTime fechaIngreso,
            LocalDateTime fechaAlerta,
            Boolean alarma,
            String estado,
            LocalDateTime fechaActualizacion
    ) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.fechaIngreso = fechaIngreso;
        this.fechaAlerta = fechaAlerta;
        this.alarma = alarma;
        this.estado = estado;
        this.fechaActualizacion = fechaActualizacion;
    }

    public Long getId() { return id; }
    public String getTitulo() { return titulo; }
    public String getDescripcion() { return descripcion; }
    public LocalDateTime getFechaIngreso() { return fechaIngreso; }
    public LocalDateTime getFechaAlerta() { return fechaAlerta; }
    public Boolean getAlarma() { return alarma; }
    public String getEstado() { return estado; }
    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }

    public void setId(Long id) { this.id = id; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public void setFechaIngreso(LocalDateTime fechaIngreso) { this.fechaIngreso = fechaIngreso; }
    public void setFechaAlerta(LocalDateTime fechaAlerta) { this.fechaAlerta = fechaAlerta; }
    public void setAlarma(Boolean alarma) { this.alarma = alarma; }
    public void setEstado(String estado) { this.estado = estado; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
}
