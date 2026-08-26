package com.tienda.faltantes.mapper;

import com.tienda.faltantes.dto.response.FiadoResponseDTO;
import com.tienda.faltantes.entity.Fiado;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FiadoMapper {

    @Mapping(source = "cliente.id", target = "clienteId")
    @Mapping(source = "cliente.nombre", target = "nombreCliente")
    @Mapping(source = "estado", target = "estado")
    @Mapping(source = "venta.id", target = "ventaId")
    FiadoResponseDTO toResponseDTO(Fiado fiado);
}