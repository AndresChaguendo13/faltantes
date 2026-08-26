package com.tienda.faltantes.mapper;

import com.tienda.faltantes.dto.response.AbonoResponseDTO;
import com.tienda.faltantes.entity.Abono;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AbonoMapper {

    @Mapping(source = "fiado.id", target = "fiadoId")
    AbonoResponseDTO toResponseDTO(Abono abono);
}