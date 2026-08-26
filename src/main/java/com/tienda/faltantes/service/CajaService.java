package com.tienda.faltantes.service;

import com.tienda.faltantes.dto.request.CajaAperturaRequestDTO;
import com.tienda.faltantes.dto.response.CajaDetalleResponseDTO;
import com.tienda.faltantes.dto.response.CajaResponseDTO;
import com.tienda.faltantes.entity.Caja;
import com.tienda.faltantes.entity.EstadoCaja;
import com.tienda.faltantes.repository.AbonoRepository;
import com.tienda.faltantes.repository.CajaRepository;
import com.tienda.faltantes.repository.VentaRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import com.tienda.faltantes.dto.request.CajaCierreRequestDTO;
import java.math.BigDecimal;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CajaService {

    private final VentaRepository ventaRepository;
    private final AbonoRepository abonoRepository;
    private final CajaRepository cajaRepository;

    public CajaService(
            VentaRepository ventaRepository,
            CajaRepository cajaRepository,
            AbonoRepository abonoRepository) {

        this.ventaRepository = ventaRepository;
        this.cajaRepository = cajaRepository;
        this.abonoRepository = abonoRepository;
    }

    public CajaResponseDTO obtenerResumenHoy() {

        CajaResponseDTO dto = new CajaResponseDTO();

        BigDecimal ventasContado = BigDecimal.valueOf(
                ventaRepository.calcularTotalContadoHoy()
        );

        BigDecimal ventasFiado = BigDecimal.valueOf(
                ventaRepository.calcularTotalFiadoHoy()
        );

        BigDecimal abonosFiados =
                abonoRepository.calcularTotalAbonosHoy();

        BigDecimal totalRecibido =
                ventasContado.add(abonosFiados);

        dto.setVentasContado(ventasContado);
        dto.setVentasFiado(ventasFiado);
        dto.setAbonosFiados(abonosFiados);
        dto.setTotalRecibido(totalRecibido);

        return dto;
    }

    @Transactional
    public Caja abrirCaja(CajaAperturaRequestDTO request) {

        if (cajaRepository.findByEstado(EstadoCaja.ABIERTA).isPresent()) {
            throw new IllegalStateException("Ya existe una caja abierta");
        }

        Caja caja = new Caja();

        caja.setFechaApertura(LocalDateTime.now());
        caja.setMontoInicial(request.getMontoInicial());
        caja.setEstado(EstadoCaja.ABIERTA);

        return cajaRepository.save(caja);
    }

    public Caja obtenerCajaAbierta() {

        return cajaRepository.findByEstado(EstadoCaja.ABIERTA)
                .orElseThrow(() ->
                        new IllegalStateException("No hay ninguna caja abierta"));
    }

    @Transactional
    public Caja cerrarCaja(CajaCierreRequestDTO request) {

        Caja caja = cajaRepository.findByEstado(EstadoCaja.ABIERTA)
                .orElseThrow(() ->
                        new IllegalStateException("No hay ninguna caja abierta"));

        LocalDateTime fechaCierre = LocalDateTime.now();

        BigDecimal ventasContado = BigDecimal.valueOf(
                ventaRepository.calcularTotalContadoEntre(
                        caja.getFechaApertura(),
                        fechaCierre
                ));

        BigDecimal abonosFiados = abonoRepository.calcularTotalAbonosEntre(
                caja.getFechaApertura(),
                fechaCierre
        );

        BigDecimal montoEsperado = caja.getMontoInicial()
                .add(ventasContado)
                .add(abonosFiados);

        BigDecimal montoFinal = request.getMontoFinal();

        BigDecimal diferencia = montoFinal.subtract(montoEsperado);

        caja.setFechaCierre(LocalDateTime.now());
        caja.setMontoEsperado(montoEsperado);
        caja.setMontoFinal(montoFinal);
        caja.setDiferencia(diferencia);
        caja.setEstado(EstadoCaja.CERRADA);

        return cajaRepository.save(caja);
    }

    public List<Caja> listarCajas() {
        return cajaRepository.findAll(
                org.springframework.data.domain.Sort.by(
                        org.springframework.data.domain.Sort.Direction.DESC,
                        "fechaApertura"
                )
        );
    }

    public Caja buscarPorId(Long id) {
        return cajaRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalStateException("Caja no encontrada"));
    }

    public CajaDetalleResponseDTO obtenerDetalle(Long id) {

        Caja caja = cajaRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalStateException("Caja no encontrada"));

        LocalDateTime fechaFin = caja.getFechaCierre() != null
                ? caja.getFechaCierre()
                : LocalDateTime.now();

        BigDecimal ventasContado = BigDecimal.valueOf(
                ventaRepository.calcularTotalContadoEntre(
                        caja.getFechaApertura(),
                        fechaFin
                ));

        BigDecimal abonosFiados = abonoRepository.calcularTotalAbonosEntre(
                caja.getFechaApertura(),
                fechaFin
        );

        BigDecimal montoEsperado = caja.getMontoInicial()
                .add(ventasContado)
                .add(abonosFiados);

        CajaDetalleResponseDTO dto = new CajaDetalleResponseDTO();

        dto.setId(caja.getId());
        dto.setFechaApertura(caja.getFechaApertura());
        dto.setFechaCierre(caja.getFechaCierre());
        dto.setMontoInicial(caja.getMontoInicial());
        dto.setVentasContado(ventasContado);
        dto.setAbonosFiados(abonosFiados);
        dto.setMontoEsperado(montoEsperado);
        dto.setMontoFinal(caja.getMontoFinal());
        dto.setDiferencia(caja.getDiferencia());
        if (caja.getDiferencia() == null) {
            dto.setResultado("PENDIENTE");
        } else if (caja.getDiferencia().compareTo(BigDecimal.ZERO) > 0) {
            dto.setResultado("SOBRANTE");
        } else if (caja.getDiferencia().compareTo(BigDecimal.ZERO) < 0) {
            dto.setResultado("FALTANTE");
        } else {
            dto.setResultado("CUADRADA");
        }
        dto.setEstado(caja.getEstado().name());

        return dto;
    }

}