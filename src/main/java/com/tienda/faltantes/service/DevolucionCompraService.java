package com.tienda.faltantes.service;

import com.tienda.faltantes.dto.request.DevolucionCompraRequestDTO;
import com.tienda.faltantes.entity.*;
import com.tienda.faltantes.enums.TipoMovimiento;
import com.tienda.faltantes.exception.RecursoNoEncontradoException;
import com.tienda.faltantes.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class DevolucionCompraService {

    private final DevolucionCompraRepository devolucionRepository;
    private final CompraRepository compraRepository;
    private final ProductoRepository productoRepository;
    private final MovimientoInventarioRepository movimientoRepository;

    public DevolucionCompraService(
            DevolucionCompraRepository devolucionRepository,
            CompraRepository compraRepository,
            ProductoRepository productoRepository,
            MovimientoInventarioRepository movimientoRepository) {

        this.devolucionRepository = devolucionRepository;
        this.compraRepository = compraRepository;
        this.productoRepository = productoRepository;
        this.movimientoRepository = movimientoRepository;
    }

    public DevolucionCompra devolverProducto(
            DevolucionCompraRequestDTO dto) {

        Compra compra = compraRepository.findById(dto.getCompraId())
                .orElseThrow(() ->
                        new RecursoNoEncontradoException(
                                "Compra no encontrada"));

        Producto producto = productoRepository.findById(dto.getProductoId())
                .orElseThrow(() ->
                        new RecursoNoEncontradoException(
                                "Producto no encontrado"));

        if (dto.getCantidad() == null || dto.getCantidad() <= 0) {
            throw new IllegalArgumentException(
                    "La cantidad a devolver debe ser mayor que cero");
        }

        DetalleCompra detalleEncontrado = null;

        for (DetalleCompra detalle : compra.getDetalles()) {

            if (detalle.getProducto().getId()
                    .equals(producto.getId())) {

                detalleEncontrado = detalle;
                break;
            }
        }

        if (detalleEncontrado == null) {
            throw new IllegalArgumentException(
                    "El producto no pertenece a la compra indicada");
        }

        int cantidadYaDevuelta = devolucionRepository
                .findByCompraId(compra.getId())
                .stream()
                .filter(d ->
                        d.getProducto().getId()
                                .equals(producto.getId()))
                .mapToInt(DevolucionCompra::getCantidad)
                .sum();

        int cantidadDisponible =
                detalleEncontrado.getCantidad()
                        - cantidadYaDevuelta;

        if (dto.getCantidad() > cantidadDisponible) {

            throw new IllegalArgumentException(
                    "No se pueden devolver "
                            + dto.getCantidad()
                            + " unidades. Solo quedan "
                            + cantidadDisponible
                            + " unidades disponibles para devolución");
        }

        Integer stockAnterior = producto.getCantidad();

        if (dto.getCantidad() > stockAnterior) {
            throw new IllegalArgumentException(
                    "No hay suficiente stock para realizar la devolución");
        }

        Integer stockNuevo =
                stockAnterior - dto.getCantidad();

        producto.setCantidad(stockNuevo);

        productoRepository.save(producto);

        double valor =
                detalleEncontrado.getPrecioUnitario()
                        * dto.getCantidad();

        DevolucionCompra devolucion =
                new DevolucionCompra();

        devolucion.setCompra(compra);
        devolucion.setProducto(producto);
        devolucion.setCantidad(dto.getCantidad());
        devolucion.setValor(valor);
        devolucion.setMotivo(dto.getMotivo());

        devolucion =
                devolucionRepository.save(devolucion);

        MovimientoInventario movimiento =
                new MovimientoInventario();

        movimiento.setProducto(producto);
        movimiento.setTipoMovimiento(
                TipoMovimiento.DEVOLUCION_COMPRA);

        movimiento.setCantidad(dto.getCantidad());

        movimiento.setStockAnterior(stockAnterior);

        movimiento.setStockNuevo(stockNuevo);

        movimiento.setObservacion(
                "Devolución a proveedor - Compra #"
                        + compra.getId()
                        + " - "
                        + dto.getMotivo());

        movimientoRepository.save(movimiento);

        return devolucion;
    }

    public java.util.List<DevolucionCompra> listar() {
        return devolucionRepository.findAll();
    }
}