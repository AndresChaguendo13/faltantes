package com.tienda.faltantes.mapper;

import com.tienda.faltantes.dto.request.ClienteRequestDTO;
import com.tienda.faltantes.dto.response.ClienteResponseDTO;
import com.tienda.faltantes.entity.Cliente;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ClienteMapper {

    Cliente toEntity(ClienteRequestDTO dto);

    ClienteResponseDTO toResponseDTO(Cliente cliente);
}