package com.tienda.faltantes.service;
import com.tienda.faltantes.dto.request.ProductoRequestDTO;
import com.tienda.faltantes.dto.response.ProductoResponseDTO;
import com.tienda.faltantes.exception.RecursoDuplicadoException;
import com.tienda.faltantes.exception.RecursoNoEncontradoException;
import com.tienda.faltantes.mapper.ProductoMapper;
import com.tienda.faltantes.entity.Producto;
import com.tienda.faltantes.repository.ProductoRepository;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    private final ProductoRepository repository;
    private final ProductoMapper mapper;

    public ProductoService(ProductoRepository repository,
                           ProductoMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public List<Producto> productosConStockBajo() {
        return repository.findByCantidadLessThanEqual(5);
    }

    public List<Producto> listar() {
        return repository.findAll();
    }


    public Page<ProductoResponseDTO> listar(Pageable pageable){

        return repository.findAll(pageable)
                .map(mapper::toResponseDTO);

    }

    public Page<ProductoResponseDTO> buscarPorNombre(String nombre,
                                                     Pageable pageable){

        return repository
                .findByNombreContainingIgnoreCase(nombre,pageable)
                .map(mapper::toResponseDTO);

    }

     public ProductoResponseDTO guardar(ProductoRequestDTO dto) {

         Producto producto = mapper.toEntity(dto);

         if (repository.existsByCodigoBarras(producto.getCodigoBarras())) {
             throw new RecursoDuplicadoException("Ya existe un producto con ese código de barras");
         }

         // Valores temporales
         producto.setStockMinimo(0);
         producto.setCostoCompra(dto.getPrecio());
         producto.setPrecioVenta(dto.getPrecio());

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
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto no encontrado"));

        if (!existente.getCodigoBarras().equals(producto.getCodigoBarras())
                && repository.existsByCodigoBarras(producto.getCodigoBarras())) {

            throw new RecursoDuplicadoException(
                    "Ya existe otro producto con ese código de barras"
            );
        }

        existente.setNombre(producto.getNombre());
        existente.setCodigoBarras(producto.getCodigoBarras());
        existente.setPrecio(producto.getPrecio());
        existente.setPrecioVenta(producto.getPrecioVenta());

        return repository.save(existente);
    }




    public void eliminar(Long id) {

        if (!repository.existsById(id)) {
            throw new RecursoNoEncontradoException("Producto no encontrado");
        }

        repository.deleteById(id);
    }

}