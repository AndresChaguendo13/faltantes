package com.tienda.faltantes.dto.request;

import jakarta.validation.constraints.NotBlank;

public class UsuarioRequestDTO {

    @NotBlank
    private String nombre;

    @NotBlank
    private String username;

    @NotBlank
    private String password;

    @NotBlank
    private String rol;

    public UsuarioRequestDTO() {
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
}