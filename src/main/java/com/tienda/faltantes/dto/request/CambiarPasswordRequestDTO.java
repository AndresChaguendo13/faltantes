package com.tienda.faltantes.dto.request;

import jakarta.validation.constraints.NotBlank;

public class CambiarPasswordRequestDTO {

    @NotBlank
    private String passwordActual;

    @NotBlank
    private String nuevaPassword;

    @NotBlank
    private String confirmarPassword;

    public CambiarPasswordRequestDTO() {
    }

    public String getPasswordActual() {
        return passwordActual;
    }

    public void setPasswordActual(String passwordActual) {
        this.passwordActual = passwordActual;
    }

    public String getNuevaPassword() {
        return nuevaPassword;
    }

    public void setNuevaPassword(String nuevaPassword) {
        this.nuevaPassword = nuevaPassword;
    }

    public String getConfirmarPassword() {
        return confirmarPassword;
    }

    public void setConfirmarPassword(String confirmarPassword) {
        this.confirmarPassword = confirmarPassword;
    }
}