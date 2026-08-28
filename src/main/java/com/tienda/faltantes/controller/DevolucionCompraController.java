package com.tienda.faltantes.controller;

import com.tienda.faltantes.dto.request.DevolucionCompraRequestDTO;
import com.tienda.faltantes.dto.response.DevolucionCompraResponseDTO;
import com.tienda.faltantes.entity.DevolucionCompra;
import com.tienda.faltantes.service.DevolucionCompraService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/devoluciones-compra")
public class DevolucionCompraController {

    private final DevolucionCompraService service;

    public DevolucionCompraController(DevolucionCompraService service) {
        this.service = service;
    }


    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")
    public DevolucionCompraResponseDTO devolverProducto(
            @RequestBody DevolucionCompraRequestDTO dto) {

        DevolucionCompra devolucion = service.devolverProducto(dto);

        DevolucionCompraResponseDTO response =
                new DevolucionCompraResponseDTO();

        response.setId(devolucion.getId());
        response.setCompraId(devolucion.getCompra().getId());
        response.setProductoId(devolucion.getProducto().getId());
        response.setNombreProducto(
                devolucion.getProducto().getNombre());
        response.setCantidad(devolucion.getCantidad());
        response.setValor(devolucion.getValor());
        response.setMotivo(devolucion.getMotivo());
        response.setFecha(devolucion.getFecha());

        return response;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO','CAJERO')")

    public java.util.List<DevolucionCompraResponseDTO> listar() {

        java.util.List<DevolucionCompra> devoluciones =
                service.listar();

        return devoluciones.stream()
                .map(devolucion -> {

                    DevolucionCompraResponseDTO response =
                            new DevolucionCompraResponseDTO();

                    response.setId(devolucion.getId());
                    response.setCompraId(
                            devolucion.getCompra().getId());
                    response.setProductoId(
                            devolucion.getProducto().getId());
                    response.setNombreProducto(
                            devolucion.getProducto().getNombre());
                    response.setCantidad(
                            devolucion.getCantidad());
                    response.setValor(
                            devolucion.getValor());
                    response.setMotivo(
                            devolucion.getMotivo());
                    response.setFecha(
                            devolucion.getFecha());

                    return response;
                })
                .toList();
    }
}