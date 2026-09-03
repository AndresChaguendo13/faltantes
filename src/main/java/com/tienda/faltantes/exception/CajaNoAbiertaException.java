package com.tienda.faltantes.exception;

public class CajaNoAbiertaException extends RuntimeException {

    public CajaNoAbiertaException(String mensaje) {
        super(mensaje);
    }
}