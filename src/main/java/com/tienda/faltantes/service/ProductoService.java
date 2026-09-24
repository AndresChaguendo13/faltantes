package com.tienda.faltantes.service;

import com.tienda.faltantes.dto.request.ProductoRequestDTO;
import com.tienda.faltantes.dto.response.ProductoResponseDTO;
import com.tienda.faltantes.entity.Categoria;
import com.tienda.faltantes.entity.Producto;
import com.tienda.faltantes.exception.RecursoDuplicadoException;
import com.tienda.faltantes.exception.RecursoNoEncontradoException;
import com.tienda.faltantes.mapper.ProductoMapper;
import com.tienda.faltantes.repository.CategoriaRepository;
import com.tienda.faltantes.repository.ProductoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    private final ProductoRepository repository;
    private final ProductoMapper mapper;
    private final CategoriaRepository categoriaRepository;

    public ProductoService(
            ProductoRepository repository,
            ProductoMapper mapper,
            CategoriaRepository categoriaRepository
    ) {
        this.repository = repository;
        this.mapper = mapper;
        this.categoriaRepository = categoriaRepository;
    }

    public List<Producto> productosConStockBajo() {
        return repository.findByCantidadLessThanEqual(5);
    }

    public List<Producto> listar() {
        return repository.findAll();
    }

    public Page<ProductoResponseDTO> listar(Pageable pageable) {
        return repository.findAll(pageable)
                .map(mapper::toResponseDTO);
    }



    public Page<ProductoResponseDTO> buscarPorNombre(
            String nombre,
            Pageable pageable
    ) {
        return repository
                .findByNombreContainingIgnoreCase(nombre, pageable)
                .map(mapper::toResponseDTO);
    }

    public Page<ProductoResponseDTO> buscarPorProveedor(
            String proveedor,
            Pageable pageable
    ) {
        return repository
                .findByProveedorIgnoreCase(proveedor, pageable)
                .map(mapper::toResponseDTO);
    }

    public List<ProductoResponseDTO> listarAleatoriosParaVenta() {

        List<Producto> productos = repository.findAll();

        java.util.Collections.shuffle(productos);

        return productos.stream()
                .limit(20)
                .map(mapper::toResponseDTO)
                .toList();
    }

    public ProductoResponseDTO guardar(ProductoRequestDTO dto) {

        Producto producto = mapper.toEntity(dto);

        if (repository.existsByCodigoBarras(producto.getCodigoBarras())) {
            throw new RecursoDuplicadoException(
                    "Ya existe un producto con ese código de barras"
            );
        }

        producto.setStockMinimo(
                dto.getStockMinimo() != null ? dto.getStockMinimo() : 0
        );

        producto.setCostoCompra(
                dto.getCostoCompra() != null
                        ? dto.getCostoCompra()
                        : dto.getPrecio()
        );

        producto.setPrecioVenta(
                dto.getPrecioVenta() != null
                        ? dto.getPrecioVenta()
                        : dto.getPrecio()
        );

        if (dto.getCategoriaId() != null) {
            Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                    .orElseThrow(() -> new RecursoNoEncontradoException(
                            "La categoría no existe"
                    ));

            producto.setCategoria(categoria);
        }

        producto.setProveedor(dto.getProveedor());
        producto.setFechaVencimiento(dto.getFechaVencimiento());

        Producto guardado = repository.save(producto);

        return mapper.toResponseDTO(guardado);
    }

    public Optional<Producto> buscarPorCodigo(String codigo) {
        return repository.findByCodigoBarras(codigo);
    }

    public Optional<Producto> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public Producto actualizar(Long id, Producto producto) {

        Producto existente = repository.findById(id)
                .orElseThrow(() ->
                        new RecursoNoEncontradoException("Producto no encontrado")
                );

        if (producto.getCodigoBarras() == null ||
                producto.getCodigoBarras().isBlank()) {

            throw new IllegalArgumentException(
                    "El código de barras es obligatorio"
            );
        }

        if (!existente.getCodigoBarras().equals(producto.getCodigoBarras())
                && repository.existsByCodigoBarras(producto.getCodigoBarras())) {

            throw new RecursoDuplicadoException(
                    "Ya existe otro producto con ese código de barras"
            );
        }

        existente.setNombre(producto.getNombre());
        existente.setCodigoBarras(producto.getCodigoBarras());
        existente.setCantidad(producto.getCantidad());
        existente.setPrecio(producto.getPrecio());
        existente.setStockMinimo(producto.getStockMinimo());
        existente.setCostoCompra(producto.getCostoCompra());
        existente.setPrecioVenta(producto.getPrecioVenta());
        existente.setProveedor(producto.getProveedor());
        existente.setFechaVencimiento(producto.getFechaVencimiento());

        if (producto.getCategoria() != null &&
                producto.getCategoria().getId() != null) {

            Categoria categoria = categoriaRepository
                    .findById(producto.getCategoria().getId())
                    .orElseThrow(() ->
                            new RecursoNoEncontradoException(
                                    "La categoría no existe"
                            )
                    );

            existente.setCategoria(categoria);

        } else {
            existente.setCategoria(null);
        }

        return repository.save(existente);
    }

    public void eliminar(Long id) {

        if (!repository.existsById(id)) {
            throw new RecursoNoEncontradoException(
                    "Producto no encontrado"
            );
        }

        repository.deleteById(id);
    }

    public Page<ProductoResponseDTO> buscarParaVenta(
            String termino,
            Pageable pageable
    ) {
        return repository
                .buscarParaVenta(termino, pageable)
                .map(mapper::toResponseDTO);
    }
}