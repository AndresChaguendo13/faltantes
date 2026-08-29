package com.tienda.faltantes.service;

import com.tienda.faltantes.dto.request.CompraRequestDTO;
import com.tienda.faltantes.dto.request.DetalleCompraRequestDTO;
import com.tienda.faltantes.entity.*;
import com.tienda.faltantes.enums.TipoMovimiento;
import com.tienda.faltantes.exception.RecursoNoEncontradoException;
import com.tienda.faltantes.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import com.tienda.faltantes.dto.response.CompraResponseDTO;
import com.tienda.faltantes.dto.response.DetalleCompraResponseDTO;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CompraService {
    private final MovimientoInventarioRepository movimientoRepository;
    private final CompraRepository compraRepository;
    private final ProductoRepository productoRepository;
    private final ProveedorRepository proveedorRepository;
    private final DetalleCompraRepository detalleCompraRepository;

    public CompraService(
            CompraRepository compraRepository,
            ProductoRepository productoRepository,
            ProveedorRepository proveedorRepository,
            DetalleCompraRepository detalleCompraRepository,
            MovimientoInventarioRepository movimientoRepository) {

        this.compraRepository = compraRepository;
        this.productoRepository = productoRepository;
        this.proveedorRepository = proveedorRepository;
        this.detalleCompraRepository = detalleCompraRepository;
        this.movimientoRepository = movimientoRepository;
    }

    public Compra guardarCompra(CompraRequestDTO dto) {

        Proveedor proveedor = proveedorRepository.findById(dto.getProveedorId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Proveedor no encontrado"));

        Compra compra = new Compra();
        compra.setProveedor(proveedor);

        compra = compraRepository.save(compra);

        for (DetalleCompraRequestDTO detalleDTO : dto.getDetalles()) {


            Producto producto = productoRepository.findById(detalleDTO.getProductoId())
                    .orElseThrow(() -> new RecursoNoEncontradoException("Producto no encontrado"));

            DetalleCompra detalle = new DetalleCompra();

            detalle.setCompra(compra);
            detalle.setProducto(producto);
            detalle.setCantidad(detalleDTO.getCantidad());
            detalle.setPrecioUnitario(detalleDTO.getPrecioCompra());

            detalleCompraRepository.save(detalle);

            Integer stockAnterior = producto.getCantidad();

            Integer stockNuevo = stockAnterior + detalleDTO.getCantidad();

            producto.setCantidad(stockNuevo);

            productoRepository.save(producto);

            MovimientoInventario movimiento = new MovimientoInventario();

            movimiento.setProducto(producto);
            movimiento.setTipoMovimiento(TipoMovimiento.COMPRA);
            movimiento.setCantidad(detalleDTO.getCantidad());
            movimiento.setStockAnterior(stockAnterior);
            movimiento.setStockNuevo(stockNuevo);
            movimiento.setObservacion("Ingreso por compra");

            movimientoRepository.save(movimiento);

        }

        return compra;
    }

    public List<CompraResponseDTO> listarCompras() {

        return compraRepository.findAll()
                .stream()
                .map(this::convertirAResponseDTO)
                .collect(Collectors.toList());
    }

    public CompraResponseDTO buscarPorId(Long id) {

        Compra compra = compraRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Compra no encontrada"));

        return convertirAResponseDTO(compra);
    }

    private CompraResponseDTO convertirAResponseDTO(Compra compra) {

        CompraResponseDTO response = new CompraResponseDTO();

        response.setId(compra.getId());
        response.setFecha(compra.getFecha());

        if (compra.getProveedor() != null) {
            response.setProveedor(compra.getProveedor().getNombre());
        }

        List<DetalleCompraResponseDTO> detalles = compra.getDetalles()
                .stream()
                .map(detalle -> {

                    DetalleCompraResponseDTO detalleResponse =
                            new DetalleCompraResponseDTO();

                    detalleResponse.setProducto(
                            detalle.getProducto().getNombre()
                    );

                    detalleResponse.setCantidad(
                            detalle.getCantidad()
                    );

                    detalleResponse.setPrecioCompra(
                            detalle.getPrecioUnitario()
                    );

                    return detalleResponse;
                })
                .collect(Collectors.toList());

        response.setDetalles(detalles);

        return response;
    }





}


