package com.tienda.faltantes.mapper;

import com.tienda.faltantes.dto.request.ProductoRequestDTO;
import com.tienda.faltantes.dto.response.ProductoResponseDTO;
import com.tienda.faltantes.entity.Producto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductoMapper {

    Producto toEntity(ProductoRequestDTO dto);

    ProductoResponseDTO toResponseDTO(Producto producto);

}