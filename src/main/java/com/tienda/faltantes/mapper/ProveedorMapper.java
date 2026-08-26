package com.tienda.faltantes.mapper;

import com.tienda.faltantes.dto.request.ProveedorRequestDTO;
import com.tienda.faltantes.dto.response.ProveedorResponseDTO;
import com.tienda.faltantes.entity.Proveedor;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProveedorMapper {

    Proveedor toEntity(ProveedorRequestDTO dto);

    ProveedorResponseDTO toResponseDTO(Proveedor proveedor);

}