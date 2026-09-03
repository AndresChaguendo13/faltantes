package com.tienda.faltantes.service;

import com.tienda.faltantes.dto.request.DetalleVentaRequestDTO;
import com.tienda.faltantes.dto.request.VentaRequestDTO;
import com.tienda.faltantes.dto.response.DetalleVentaResponseDTO;
import com.tienda.faltantes.dto.response.VentaResponseDTO;
import com.tienda.faltantes.entity.DetalleVenta;
import com.tienda.faltantes.entity.MovimientoInventario;
import com.tienda.faltantes.entity.Producto;
import com.tienda.faltantes.entity.Venta;
import com.tienda.faltantes.enums.TipoMovimiento;
import com.tienda.faltantes.exception.RecursoNoEncontradoException;
import com.tienda.faltantes.repository.MovimientoInventarioRepository;
import com.tienda.faltantes.repository.ProductoRepository;
import com.tienda.faltantes.repository.VentaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.tienda.faltantes.entity.Cliente;
import com.tienda.faltantes.entity.Fiado;
import com.tienda.faltantes.entity.EstadoFiado;
import com.tienda.faltantes.entity.TipoPago;
import com.tienda.faltantes.repository.ClienteRepository;
import com.tienda.faltantes.repository.FiadoRepository;
import com.tienda.faltantes.repository.DevolucionVentaRepository;
import com.tienda.faltantes.dto.response.ProductoMasVendidoResponseDTO;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import com.tienda.faltantes.service.CajaService;
import com.tienda.faltantes.exception.CajaNoAbiertaException;

@Service
@Transactional
public class VentaService {
    private final MovimientoInventarioRepository movimientoRepository;
    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository;
    private final ClienteRepository clienteRepository;
    private final FiadoRepository fiadoRepository;
    private final DevolucionVentaRepository devolucionVentaRepository;
    private final CajaService cajaService;


    public VentaService(
            VentaRepository ventaRepository,
            ProductoRepository productoRepository,
            MovimientoInventarioRepository movimientoRepository,
            ClienteRepository clienteRepository,
            FiadoRepository fiadoRepository,
            DevolucionVentaRepository devolucionVentaRepository,
            CajaService cajaService) {

        this.ventaRepository = ventaRepository;
        this.productoRepository = productoRepository;
        this.movimientoRepository = movimientoRepository;
        this.clienteRepository = clienteRepository;
        this.fiadoRepository = fiadoRepository;
        this.devolucionVentaRepository = devolucionVentaRepository;
        this.cajaService = cajaService;
    }

    public VentaResponseDTO buscarPorId(Long id) {

        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() ->
                        new RecursoNoEncontradoException(
                                "Venta no encontrada"
                        ));

        VentaResponseDTO response = new VentaResponseDTO();

        response.setId(venta.getId());
        response.setFecha(venta.getFecha());
        response.setTotal(venta.getTotal());

        response.setTipoPago(
                venta.getTipoPago() != null
                        ? venta.getTipoPago().name()
                        : null
        );

        if (venta.getCliente() != null) {
            response.setClienteId(venta.getCliente().getId());
            response.setNombreCliente(venta.getCliente().getNombre());
        }

        fiadoRepository.findByVentaId(venta.getId())
                .ifPresent(fiado ->
                        response.setFiadoId(fiado.getId())
                );


        List<DetalleVentaResponseDTO> detallesResponse =
                venta.getDetalles()
                        .stream()
                        .map(detalle -> {

                            DetalleVentaResponseDTO detalleDTO =
                                    new DetalleVentaResponseDTO();

                            detalleDTO.setProducto(
                                    detalle.getProducto().getNombre()
                            );

                            detalleDTO.setCantidad(
                                    detalle.getCantidad()
                            );

                            detalleDTO.setPrecioUnitario(
                                    detalle.getPrecioUnitario()
                            );

                            detalleDTO.setSubtotal(
                                    detalle.getSubtotal()
                            );

                            return detalleDTO;
                        })
                        .toList();

        response.setDetalles(detallesResponse);

        return response;
    }

    public List<VentaResponseDTO> listar() {

        return ventaRepository.findAll()
                .stream()
                .map(venta -> {

                    VentaResponseDTO response = new VentaResponseDTO();

                    response.setId(venta.getId());
                    response.setFecha(venta.getFecha());
                    response.setTotal(venta.getTotal());

                    response.setTipoPago(
                            venta.getTipoPago() != null
                                    ? venta.getTipoPago().name()
                                    : null
                    );

                    if (venta.getCliente() != null) {
                        response.setClienteId(venta.getCliente().getId());
                        response.setNombreCliente(venta.getCliente().getNombre());
                    }

                    fiadoRepository.findByVentaId(venta.getId())
                            .ifPresent(fiado ->
                                    response.setFiadoId(fiado.getId())
                            );

                    List<DetalleVentaResponseDTO> detallesResponse =
                            venta.getDetalles()
                                    .stream()
                                    .map(detalle -> {

                                        DetalleVentaResponseDTO detalleDTO =
                                                new DetalleVentaResponseDTO();

                                        detalleDTO.setProducto(
                                                detalle.getProducto().getNombre()
                                        );

                                        detalleDTO.setCantidad(
                                                detalle.getCantidad()
                                        );

                                        detalleDTO.setPrecioUnitario(
                                                detalle.getPrecioUnitario()
                                        );

                                        detalleDTO.setSubtotal(
                                                detalle.getSubtotal()
                                        );

                                        return detalleDTO;
                                    })
                                    .toList();

                    response.setDetalles(detallesResponse);

                    return response;
                })
                .toList();
    }


    public VentaResponseDTO guardar(VentaRequestDTO dto) {

        if (dto.getTipoPago() == null || dto.getTipoPago().isBlank()) {
            throw new IllegalArgumentException(
                    "El tipo de pago es obligatorio"
            );
        }

        if ("FIADO".equalsIgnoreCase(dto.getTipoPago())
                && dto.getClienteId() == null) {
            throw new IllegalArgumentException(
                    "Una venta fiada requiere un cliente"
            );
        }
        Venta venta = new Venta();

        TipoPago tipoPago;

        try {
            tipoPago = TipoPago.valueOf(
                    dto.getTipoPago().toUpperCase()
            );
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                    "Tipo de pago inválido. Use CONTADO o FIADO"
            );
        }

        if (tipoPago == TipoPago.CONTADO) {
            cajaService.obtenerCajaAbierta();
        }

        venta.setTipoPago(tipoPago);

        if (dto.getClienteId() != null) {

            Cliente cliente = clienteRepository.findById(dto.getClienteId())
                    .orElseThrow(() ->
                            new RecursoNoEncontradoException(
                                    "Cliente no encontrado"
                            ));

            venta.setCliente(cliente);
        }

        double total = 0;


        for (DetalleVentaRequestDTO detalleDTO : dto.getDetalles()) {

            Producto producto = productoRepository.findById(detalleDTO.getProductoId())
                    .orElseThrow(() ->
                            new RecursoNoEncontradoException("Producto no encontrado"));

            if (producto.getCantidad() < detalleDTO.getCantidad()) {
                throw new IllegalArgumentException(
                        "No hay suficiente inventario de " + producto.getNombre());
            }

            producto.setCantidad(
                    producto.getCantidad() - detalleDTO.getCantidad());

            productoRepository.save(producto);

            Integer stockAnterior = producto.getCantidad() + detalleDTO.getCantidad();

            MovimientoInventario movimiento = new MovimientoInventario();

            movimiento.setProducto(producto);
            movimiento.setTipoMovimiento(TipoMovimiento.VENTA);
            movimiento.setCantidad(detalleDTO.getCantidad());
            movimiento.setStockAnterior(stockAnterior);
            movimiento.setStockNuevo(producto.getCantidad());
            movimiento.setObservacion("Salida por venta");

            movimientoRepository.save(movimiento);

            DetalleVenta detalle = new DetalleVenta();

            detalle.setVenta(venta);
            detalle.setProducto(producto);
            detalle.setCantidad(detalleDTO.getCantidad());

            detalle.setPrecioUnitario(producto.getPrecioVenta());
            detalle.setCostoUnitario(producto.getCostoCompra());

            detalle.setSubtotal(
                    detalleDTO.getCantidad() * producto.getPrecioVenta());

            total += detalle.getSubtotal();

            venta.getDetalles().add(detalle);
        }

        venta.setTotal(total);

        Venta guardada = ventaRepository.save(venta);

        Fiado fiado = null;

        if ("FIADO".equalsIgnoreCase(dto.getTipoPago())) {

            Cliente cliente = clienteRepository.findById(dto.getClienteId())
                    .orElseThrow(() ->
                            new RecursoNoEncontradoException(
                                    "Cliente no encontrado"
                            ));

            fiado = new Fiado();

            fiado.setCliente(cliente);
            fiado.setVenta(guardada);
            fiado.setValorOriginal(
                    BigDecimal.valueOf(guardada.getTotal())
            );
            fiado.setValorAbonado(BigDecimal.ZERO);
            fiado.setSaldoPendiente(
                    BigDecimal.valueOf(guardada.getTotal())
            );
            fiado.setEstado(EstadoFiado.PENDIENTE);

            fiado = fiadoRepository.save(fiado);
        }
        VentaResponseDTO response = new VentaResponseDTO();

        response.setId(guardada.getId());
        response.setFecha(guardada.getFecha());
        response.setTotal(guardada.getTotal());

        response.setTipoPago(
                guardada.getTipoPago() != null
                        ? guardada.getTipoPago().name()
                        : null
        );

        if (guardada.getCliente() != null) {
            response.setClienteId(guardada.getCliente().getId());
            response.setNombreCliente(guardada.getCliente().getNombre());
        }
        if (fiado != null) {
            response.setFiadoId(fiado.getId());
        }

        List<DetalleVentaResponseDTO> detallesResponse = guardada.getDetalles()
                .stream()
                .map(detalle -> {
                    DetalleVentaResponseDTO detalleDTO = new DetalleVentaResponseDTO();

                    detalleDTO.setProducto(detalle.getProducto().getNombre());
                    detalleDTO.setCantidad(detalle.getCantidad());
                    detalleDTO.setPrecioUnitario(detalle.getPrecioUnitario());
                    detalleDTO.setSubtotal(detalle.getSubtotal());

                    return detalleDTO;
                })
                .toList();

        response.setDetalles(detallesResponse);

        return response;
    }

    @Transactional
    public VentaResponseDTO actualizarTipoPago(Long id, String tipoPago) {

        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() ->
                        new RecursoNoEncontradoException("Venta no encontrada"));

        if (tipoPago == null || tipoPago.isBlank()) {
            throw new IllegalArgumentException(
                    "El tipo de pago es obligatorio");
        }

        TipoPago nuevoTipo;

        try {
            nuevoTipo = TipoPago.valueOf(tipoPago.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                    "Tipo de pago inválido. Use CONTADO o FIADO");
        }

        TipoPago tipoActual = venta.getTipoPago();

        // Si no hay ningún cambio, simplemente devolvemos la venta
        if (tipoActual == nuevoTipo) {
            return buscarPorId(id);
        }

        // =========================================================
        // CONTADO -> FIADO
        // =========================================================
        if (nuevoTipo == TipoPago.FIADO) {

            if (venta.getCliente() == null) {
                throw new IllegalArgumentException(
                        "No se puede convertir a FIADO una venta sin cliente");
            }

            Optional<Fiado> fiadoExistente =
                    fiadoRepository.findByVentaId(venta.getId());

            if (fiadoExistente.isPresent()) {
                throw new IllegalArgumentException(
                        "La venta ya tiene un fiado asociado");
            }

            venta.setTipoPago(TipoPago.FIADO);

            Venta guardada = ventaRepository.save(venta);

            Fiado fiado = new Fiado();
            fiado.setVenta(guardada);
            fiado.setCliente(guardada.getCliente());
            fiado.setValorOriginal(
                    BigDecimal.valueOf(guardada.getTotal()));
            fiado.setValorAbonado(BigDecimal.ZERO);
            fiado.setSaldoPendiente(
                    BigDecimal.valueOf(guardada.getTotal()));
            fiado.setEstado(EstadoFiado.PENDIENTE);

            fiadoRepository.save(fiado);
        }

        // =========================================================
        // FIADO -> CONTADO
        // =========================================================
        else if (nuevoTipo == TipoPago.CONTADO) {

            Optional<Fiado> fiadoExistente =
                    fiadoRepository.findByVentaId(venta.getId());

            if (fiadoExistente.isPresent()) {

                Fiado fiado = fiadoExistente.get();

                if (fiado.getValorAbonado() != null
                        && fiado.getValorAbonado()
                        .compareTo(BigDecimal.ZERO) > 0) {

                    throw new IllegalArgumentException(
                            "No se puede cambiar a CONTADO una venta fiada que ya tiene abonos");
                }

                fiadoRepository.delete(fiado);
            }

            venta.setTipoPago(TipoPago.CONTADO);
            ventaRepository.save(venta);
        }

        return buscarPorId(id);
    }


    public Double obtenerTotalVentasHoy() {
        return ventaRepository.calcularTotalVentasHoy();
    }

    public Double obtenerTotalContadoHoy() {
        return ventaRepository.calcularTotalContadoHoy();
    }

    public Double obtenerTotalFiadoHoy() {
        return ventaRepository.calcularTotalFiadoHoy();
    }


    public List<ProductoMasVendidoResponseDTO> obtenerProductosMasVendidos(
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin) {

        List<Object[]> resultados =
                ventaRepository.calcularProductosMasVendidos(
                        fechaInicio,
                        fechaFin
                );

        return resultados.stream()
                .map(resultado -> new ProductoMasVendidoResponseDTO(
                        ((Number) resultado[0]).longValue(),
                        (String) resultado[1],
                        ((Number) resultado[2]).longValue()
                ))
                .toList();
    }



}