package com.tienda.faltantes.mapper;

import com.tienda.faltantes.dto.request.ProductoRequestDTO;
import com.tienda.faltantes.dto.response.ProductoResponseDTO;
import com.tienda.faltantes.entity.Producto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductoMapper {

    Producto toEntity(ProductoRequestDTO dto);

    @Mapping(target = "categoriaId", source = "categoria.id")
    @Mapping(target = "categoriaNombre", source = "categoria.nombre")
    ProductoResponseDTO toResponseDTO(Producto producto);
}