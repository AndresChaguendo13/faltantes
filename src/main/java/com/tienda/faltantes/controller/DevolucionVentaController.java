package com.tienda.faltantes.controller;

import com.tienda.faltantes.dto.request.DevolucionVentaRequestDTO;
import com.tienda.faltantes.dto.response.DevolucionVentaResponseDTO;
import com.tienda.faltantes.entity.DevolucionVenta;
import com.tienda.faltantes.service.DevolucionVentaService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/devoluciones-venta")
public class DevolucionVentaController {

    private final DevolucionVentaService service;

    public DevolucionVentaController(DevolucionVentaService service) {
        this.service = service;
    }

    @PostMapping
    public DevolucionVentaResponseDTO devolverProducto(
            @RequestBody DevolucionVentaRequestDTO dto) {

        DevolucionVenta devolucion = service.devolverProducto(dto);

        DevolucionVentaResponseDTO response = new DevolucionVentaResponseDTO();

        response.setId(devolucion.getId());
        response.setVentaId(devolucion.getVenta().getId());
        response.setProductoId(devolucion.getProducto().getId());
        response.setNombreProducto(devolucion.getProducto().getNombre());
        response.setCantidad(devolucion.getCantidad());
        response.setValor(devolucion.getValor());
        response.setMotivo(devolucion.getMotivo());
        response.setFecha(devolucion.getFecha());

        return response;
    }
}