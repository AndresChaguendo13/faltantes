package com.tienda.faltantes.service;

import com.tienda.faltantes.dto.request.AjusteInventarioRequestDTO;
import com.tienda.faltantes.entity.MovimientoInventario;
import com.tienda.faltantes.entity.Producto;
import com.tienda.faltantes.enums.TipoMovimiento;
import com.tienda.faltantes.exception.RecursoNoEncontradoException;
import com.tienda.faltantes.repository.MovimientoInventarioRepository;
import com.tienda.faltantes.repository.ProductoRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class MovimientoInventarioService {

    private final MovimientoInventarioRepository repository;
    private final ProductoRepository productoRepository;

    public MovimientoInventarioService(
            MovimientoInventarioRepository repository,
            ProductoRepository productoRepository) {

        this.repository = repository;
        this.productoRepository = productoRepository;
    }

    public List<MovimientoInventario> listar() {
        return repository.findAll();
    }

    public MovimientoInventario ajustarStock(AjusteInventarioRequestDTO dto) {

        Producto producto = productoRepository.findById(dto.getProductoId())
                .orElseThrow(() ->
                        new RecursoNoEncontradoException("Producto no encontrado"));

        Integer stockAnterior = producto.getCantidad();
        Integer stockNuevo = dto.getCantidadNueva();

        if (stockNuevo == null || stockNuevo < 0) {
            throw new IllegalArgumentException(
                    "La cantidad nueva no puede ser negativa");
        }

        if (stockNuevo.equals(stockAnterior)) {
            throw new IllegalArgumentException(
                    "El nuevo stock debe ser diferente al stock actual");
        }

        TipoMovimiento tipo;

        if (stockNuevo > stockAnterior) {
            tipo = TipoMovimiento.AJUSTE_ENTRADA;
        } else {
            tipo = TipoMovimiento.AJUSTE_SALIDA;
        }

        Integer cantidad = Math.abs(stockNuevo - stockAnterior);

        producto.setCantidad(stockNuevo);
        productoRepository.save(producto);

        MovimientoInventario movimiento = new MovimientoInventario();

        movimiento.setProducto(producto);
        movimiento.setTipoMovimiento(tipo);
        movimiento.setCantidad(cantidad);
        movimiento.setStockAnterior(stockAnterior);
        movimiento.setStockNuevo(stockNuevo);
        movimiento.setObservacion(dto.getObservacion());

        return repository.save(movimiento);
    }
}