package com.tienda.faltantes.service;

import com.tienda.faltantes.dto.request.CajaAperturaRequestDTO;
import com.tienda.faltantes.dto.response.CajaDetalleResponseDTO;
import com.tienda.faltantes.dto.response.CajaResponseDTO;
import com.tienda.faltantes.entity.Caja;
import com.tienda.faltantes.entity.EstadoCaja;
import com.tienda.faltantes.exception.CajaNoAbiertaException;
import com.tienda.faltantes.repository.AbonoRepository;
import com.tienda.faltantes.repository.CajaRepository;
import com.tienda.faltantes.repository.VentaRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import com.tienda.faltantes.dto.request.CajaCierreRequestDTO;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import com.tienda.faltantes.repository.DevolucionVentaRepository;

@Service
public class CajaService {

    private final VentaRepository ventaRepository;
    private final AbonoRepository abonoRepository;
    private final CajaRepository cajaRepository;
    private final DevolucionVentaRepository devolucionVentaRepository;

    public CajaService(
            VentaRepository ventaRepository,
            CajaRepository cajaRepository,
            AbonoRepository abonoRepository,
            DevolucionVentaRepository devolucionVentaRepository) {

        this.ventaRepository = ventaRepository;
        this.cajaRepository = cajaRepository;
        this.abonoRepository = abonoRepository;
        this.devolucionVentaRepository = devolucionVentaRepository;
    }

    public CajaResponseDTO obtenerResumenHoy() {

        Caja caja = cajaRepository.findByEstado(EstadoCaja.ABIERTA)
                .orElseThrow(() ->
                        new IllegalStateException("No hay ninguna caja abierta"));

        LocalDateTime fechaInicio = caja.getFechaApertura();
        LocalDateTime fechaFin = LocalDateTime.now();

        CajaResponseDTO dto = new CajaResponseDTO();

        BigDecimal ventasContado = BigDecimal.valueOf(
                ventaRepository.calcularTotalContadoEntre(
                        fechaInicio,
                        fechaFin
                )
        );

        BigDecimal ventasFiado = BigDecimal.valueOf(
                ventaRepository.calcularTotalFiadoEntre(
                        fechaInicio,
                        fechaFin
                )
        );

        BigDecimal abonosFiados =
                abonoRepository.calcularTotalAbonosEntre(
                        fechaInicio,
                        fechaFin
                );
        BigDecimal devolucionesVenta =
                devolucionVentaRepository.calcularTotalContadoEntre(
                        fechaInicio,
                        fechaFin
                );

        BigDecimal totalRecibido =
                ventasContado
                        .add(abonosFiados)
                        .subtract(devolucionesVenta);

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
                        new CajaNoAbiertaException("No hay ninguna caja abierta"));
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

        BigDecimal devolucionesVenta =
                devolucionVentaRepository.calcularTotalContadoEntre(
                        caja.getFechaApertura(),
                        fechaCierre
                );

        BigDecimal abonosFiados = abonoRepository.calcularTotalAbonosEntre(
                caja.getFechaApertura(),
                fechaCierre
        );

        BigDecimal montoEsperado = caja.getMontoInicial()
                .add(ventasContado)
                .add(abonosFiados)
                .subtract(devolucionesVenta);

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

        BigDecimal devolucionesVenta =
                devolucionVentaRepository.calcularTotalContadoEntre(
                        caja.getFechaApertura(),
                        fechaFin
                );

        BigDecimal montoEsperado = caja.getMontoInicial()
                .add(ventasContado)
                .add(abonosFiados)
                .subtract(devolucionesVenta);

        System.out.println("===== DEBUG CAJA =====");
        System.out.println("Monto inicial: " + caja.getMontoInicial());
        System.out.println("Ventas contado: " + ventasContado);
        System.out.println("Abonos fiados: " + abonosFiados);
        System.out.println("Devoluciones: " + devolucionesVenta);
        System.out.println("Monto esperado: " + montoEsperado);
        System.out.println("======================");

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