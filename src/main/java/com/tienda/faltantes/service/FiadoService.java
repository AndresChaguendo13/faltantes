package com.tienda.faltantes.service;

import com.tienda.faltantes.dto.request.FiadoRequestDTO;
import com.tienda.faltantes.dto.response.AbonoResponseDTO;
import com.tienda.faltantes.dto.response.EstadoCuentaResponseDTO;
import com.tienda.faltantes.dto.response.FiadoDetalleResponseDTO;
import com.tienda.faltantes.dto.response.FiadoResponseDTO;
import com.tienda.faltantes.entity.Cliente;
import com.tienda.faltantes.entity.EstadoFiado;
import com.tienda.faltantes.entity.Fiado;
import com.tienda.faltantes.exception.RecursoNoEncontradoException;
import com.tienda.faltantes.mapper.FiadoMapper;
import com.tienda.faltantes.repository.ClienteRepository;
import com.tienda.faltantes.repository.FiadoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class FiadoService {

    private final AbonoService abonoService;
    private final FiadoRepository fiadoRepository;
    private final ClienteRepository clienteRepository;
    private final FiadoMapper mapper;

    public FiadoService(FiadoRepository fiadoRepository,
                        ClienteRepository clienteRepository,
                        FiadoMapper mapper,
                        AbonoService abonoService) {

        this.fiadoRepository = fiadoRepository;
        this.clienteRepository = clienteRepository;
        this.mapper = mapper;
        this.abonoService = abonoService;
    }

    public FiadoResponseDTO guardar(FiadoRequestDTO dto) {

        Cliente cliente = clienteRepository.findById(dto.getClienteId())
                .orElseThrow(() ->
                        new RecursoNoEncontradoException(
                                "Cliente no encontrado"
                        ));

        Fiado fiado = new Fiado();

        fiado.setCliente(cliente);
        fiado.setValorOriginal(dto.getValorOriginal());
        fiado.setValorAbonado(BigDecimal.ZERO);
        fiado.setSaldoPendiente(dto.getValorOriginal());
        fiado.setEstado(EstadoFiado.PENDIENTE);

        Fiado guardado = fiadoRepository.save(fiado);

        return mapper.toResponseDTO(guardado);
    }

    public List<FiadoResponseDTO> listar() {

        return fiadoRepository.findAll()
                .stream()
                .map(mapper::toResponseDTO)
                .toList();
    }

    public FiadoResponseDTO buscarPorId(Long id) {

        Fiado fiado = fiadoRepository.findById(id)
                .orElseThrow(() ->
                        new RecursoNoEncontradoException(
                                "Fiado no encontrado"
                        ));

        return mapper.toResponseDTO(fiado);
    }

    public BigDecimal calcularSaldoCliente(Long clienteId) {

        if (!clienteRepository.existsById(clienteId)) {
            throw new RecursoNoEncontradoException(
                    "Cliente no encontrado"
            );
        }

        return fiadoRepository.calcularSaldoCliente(
                clienteId,
                EstadoFiado.PENDIENTE
        );
    }

    public List<FiadoResponseDTO> listarPorCliente(Long clienteId) {

        if (!clienteRepository.existsById(clienteId)) {
            throw new RecursoNoEncontradoException(
                    "Cliente no encontrado"
            );
        }

        return fiadoRepository.findByClienteId(clienteId)
                .stream()
                .map(mapper::toResponseDTO)
                .toList();
    }

    public FiadoDetalleResponseDTO obtenerDetalle(Long fiadoId) {

        Fiado fiado = fiadoRepository.findById(fiadoId)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Fiado no encontrado"
                ));



        List<AbonoResponseDTO> abonos =
                abonoService.listarPorFiado(fiadoId);

        FiadoDetalleResponseDTO dto = new FiadoDetalleResponseDTO();

        if (fiado.getVenta() != null) {
            dto.setVentaId(fiado.getVenta().getId());
        }

        dto.setId(fiado.getId());
        dto.setClienteId(fiado.getCliente().getId());
        dto.setNombreCliente(fiado.getCliente().getNombre());
        dto.setValorOriginal(fiado.getValorOriginal());
        dto.setValorAbonado(fiado.getValorAbonado());
        dto.setSaldoPendiente(fiado.getSaldoPendiente());
        dto.setEstado(fiado.getEstado().name());
        dto.setFecha(fiado.getFecha());
        dto.setAbonos(abonos);


        return dto;


    }

    public EstadoCuentaResponseDTO obtenerEstadoCuenta(Long clienteId) {

        List<FiadoResponseDTO> fiados = listarPorCliente(clienteId);

        if (fiados.isEmpty()) {
            throw new RecursoNoEncontradoException(
                    "El cliente no tiene fiados registrados");
        }

        EstadoCuentaResponseDTO dto = new EstadoCuentaResponseDTO();

        FiadoResponseDTO primerFiado = fiados.get(0);

        dto.setClienteId(primerFiado.getClienteId());
        dto.setNombreCliente(primerFiado.getNombreCliente());
        dto.setTotalFiados(fiados.size());

        BigDecimal totalOriginal = fiados.stream()
                .map(FiadoResponseDTO::getValorOriginal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalAbonado = fiados.stream()
                .map(FiadoResponseDTO::getValorAbonado)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal saldoPendiente = fiados.stream()
                .map(FiadoResponseDTO::getSaldoPendiente)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        dto.setTotalOriginal(totalOriginal);
        dto.setTotalAbonado(totalAbonado);
        dto.setSaldoPendiente(saldoPendiente);
        dto.setFiados(fiados);

        return dto;
    }
}