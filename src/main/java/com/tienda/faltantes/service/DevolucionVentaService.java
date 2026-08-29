package com.tienda.faltantes.service;

import com.tienda.faltantes.dto.request.DevolucionVentaRequestDTO;
import com.tienda.faltantes.entity.*;
import com.tienda.faltantes.enums.TipoMovimiento;
import com.tienda.faltantes.exception.RecursoNoEncontradoException;
import com.tienda.faltantes.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@Transactional
public class DevolucionVentaService {

    private final DevolucionVentaRepository devolucionRepository;
    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository;
    private final MovimientoInventarioRepository movimientoRepository;
    private final FiadoRepository fiadoRepository;

    public DevolucionVentaService(
            DevolucionVentaRepository devolucionRepository,
            VentaRepository ventaRepository,
            ProductoRepository productoRepository,
            MovimientoInventarioRepository movimientoRepository,
            FiadoRepository fiadoRepository) {

        this.devolucionRepository = devolucionRepository;
        this.ventaRepository = ventaRepository;
        this.productoRepository = productoRepository;
        this.movimientoRepository = movimientoRepository;
        this.fiadoRepository = fiadoRepository;
    }

    public DevolucionVenta devolverProducto(DevolucionVentaRequestDTO dto) {

        Venta venta = ventaRepository.findById(dto.getVentaId())
                .orElseThrow(() ->
                        new RecursoNoEncontradoException("Venta no encontrada"));

        Producto producto = productoRepository.findById(dto.getProductoId())
                .orElseThrow(() ->
                        new RecursoNoEncontradoException("Producto no encontrado"));

        if (dto.getCantidad() == null || dto.getCantidad() <= 0) {
            throw new IllegalArgumentException(
                    "La cantidad a devolver debe ser mayor que cero");
        }

        DetalleVenta detalleEncontrado = null;

        for (DetalleVenta detalle : venta.getDetalles()) {
            if (detalle.getProducto().getId().equals(producto.getId())) {
                detalleEncontrado = detalle;
                break;
            }
        }

        if (detalleEncontrado == null) {
            throw new IllegalArgumentException(
                    "El producto no pertenece a la venta indicada");
        }

        int cantidadYaDevuelta = devolucionRepository
                .findByVentaId(venta.getId())
                .stream()
                .filter(d -> d.getProducto().getId().equals(producto.getId()))
                .mapToInt(DevolucionVenta::getCantidad)
                .sum();

        int cantidadDisponible = detalleEncontrado.getCantidad()
                - cantidadYaDevuelta;

        if (dto.getCantidad() > cantidadDisponible) {
            throw new IllegalArgumentException(
                    "No se pueden devolver " + dto.getCantidad()
                            + " unidades. Solo quedan "
                            + cantidadDisponible
                            + " unidades disponibles para devolución");
        }

        Integer stockAnterior = producto.getCantidad();
        Integer stockNuevo = stockAnterior + dto.getCantidad();

        producto.setCantidad(stockNuevo);
        productoRepository.save(producto);

        double valor = detalleEncontrado.getPrecioUnitario()
                * dto.getCantidad();

        if (venta.getTipoPago() == TipoPago.FIADO) {

            Fiado fiado = fiadoRepository.findByVentaId(venta.getId())
                    .orElseThrow(() ->
                            new IllegalStateException(
                                    "La venta fiada no tiene un fiado asociado"));

            BigDecimal valorDevolucion =
                    BigDecimal.valueOf(valor);

            BigDecimal nuevoSaldo =
                    fiado.getSaldoPendiente()
                            .subtract(valorDevolucion);

            if (nuevoSaldo.compareTo(BigDecimal.ZERO) < 0) {
                nuevoSaldo = BigDecimal.ZERO;
            }

            fiado.setSaldoPendiente(nuevoSaldo);

            if (nuevoSaldo.compareTo(BigDecimal.ZERO) == 0) {
                fiado.setEstado(EstadoFiado.PAGADO);
            }

            fiadoRepository.save(fiado);

        }

        DevolucionVenta devolucion = new DevolucionVenta();

        devolucion.setVenta(venta);
        devolucion.setProducto(producto);
        devolucion.setCantidad(dto.getCantidad());
        devolucion.setValor(valor);
        devolucion.setMotivo(dto.getMotivo());

        devolucion = devolucionRepository.save(devolucion);

        MovimientoInventario movimiento = new MovimientoInventario();

        movimiento.setProducto(producto);
        movimiento.setTipoMovimiento(TipoMovimiento.DEVOLUCION_VENTA);
        movimiento.setCantidad(dto.getCantidad());
        movimiento.setStockAnterior(stockAnterior);
        movimiento.setStockNuevo(stockNuevo);
        movimiento.setObservacion(
                "Devolución de venta #" + venta.getId()
                        + " - " + dto.getMotivo());

        movimientoRepository.save(movimiento);

        return devolucion;
    }
}