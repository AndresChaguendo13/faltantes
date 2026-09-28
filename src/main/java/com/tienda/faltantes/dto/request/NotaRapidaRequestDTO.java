package com.tienda.faltantes.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class NotaRapidaRequestDTO {

    @NotBlank
    @Size(max = 100)
    private String titulo;

    @NotBlank
    private String descripcion;

    private LocalDateTime fechaAlerta;

    private Boolean alarma = false;

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public LocalDateTime getFechaAlerta() { return fechaAlerta; }
    public void setFechaAlerta(LocalDateTime fechaAlerta) { this.fechaAlerta = fechaAlerta; }

    public Boolean getAlarma() { return alarma; }
    public void setAlarma(Boolean alarma) { this.alarma = alarma; }
}
