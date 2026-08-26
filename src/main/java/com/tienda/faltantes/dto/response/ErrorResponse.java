package com.tienda.faltantes.dto.response;

import java.time.LocalDateTime;

public class ErrorResponse {

    private LocalDateTime fecha;
    private Integer codigo;
    private String error;

    public ErrorResponse() {
    }

    public ErrorResponse(LocalDateTime fecha, Integer codigo, String error) {
        this.fecha = fecha;
        this.codigo = codigo;
        this.error = error;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public Integer getCodigo() {
        return codigo;
    }

    public void setCodigo(Integer codigo) {
        this.codigo = codigo;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
}