package com.tienda.faltantes.service;

import com.tienda.faltantes.dto.response.DashboardResponseDTO;
import com.tienda.faltantes.entity.Producto;
import com.tienda.faltantes.repository.*;
import org.springframework.stereotype.Service;
import com.tienda.faltantes.entity.EstadoFiado;
import com.tienda.faltantes.entity.Caja;
import com.tienda.faltantes.entity.EstadoCaja;
import com.tienda.faltantes.dto.response.CajaDetalleResponseDTO;
import java.math.BigDecimal;
import java.util.List;
import com.tienda.faltantes.repository.DevolucionVentaRepository;
import com.tienda.faltantes.repository.DevolucionCompraRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class DashboardService {

    private final ProductoRepository productoRepository;
    private final CompraRepository compraRepository;
    private final VentaRepository ventaRepository;
    private final FiadoRepository fiadoRepository;
    private final CajaService cajaService;
    private final CajaRepository cajaRepository;
    private final DevolucionVentaRepository devolucionVentaRepository;
    private final DevolucionCompraRepository devolucionCompraRepository;

    public DashboardService(
            ProductoRepository productoRepository,
            CompraRepository compraRepository,
            VentaRepository ventaRepository,
            FiadoRepository fiadoRepository,
            CajaService cajaService,
            CajaRepository cajaRepository, DevolucionVentaRepository devolucionVentaRepository, DevolucionCompraRepository devolucionCompraRepository) {

        this.productoRepository = productoRepository;
        this.compraRepository = compraRepository;
        this.ventaRepository = ventaRepository;
        this.fiadoRepository = fiadoRepository;
        this.cajaService = cajaService;
        this.cajaRepository = cajaRepository;
        this.devolucionVentaRepository = devolucionVentaRepository;
        this.devolucionCompraRepository = devolucionCompraRepository;
    }

    public DashboardResponseDTO obtenerDashboard() {

        DashboardResponseDTO dto = new DashboardResponseDTO();

        dto.setTotalProductos(productoRepository.count());

        dto.setProductosStockBajo(
                (long) productoRepository.findByCantidadLessThanEqual(5).size());

        dto.setTotalCompras(compraRepository.count());

        dto.setTotalVentas(ventaRepository.count());

        double valor = 0;

        for (Producto p : productoRepository.findAll()) {
            valor += p.getCantidad() * p.getCostoCompra();
        }

        dto.setValorInventario(valor);
        dto.setVentasHoy(ventaRepository.calcularTotalVentasHoy());
        dto.setVentasContadoHoy(ventaRepository.calcularTotalContadoHoy());
        dto.setVentasFiadoHoy(ventaRepository.calcularTotalFiadoHoy());

        LocalDateTime inicioHoy = LocalDate.now().atStartOfDay();
        LocalDateTime finHoy = LocalDate.now().plusDays(1).atStartOfDay().minusNanos(1);

        Double costoVentasBrutoHoy =
                ventaRepository.calcularCostoVentasEntre(inicioHoy, finHoy);

        Double costoDevolucionesHoy =
                devolucionVentaRepository.calcularCostoDevolucionesEntre(
                        inicioHoy,
                        finHoy
                );

        Double costoVentasHoy =
                costoVentasBrutoHoy - costoDevolucionesHoy;

        Double ventasBrutasHoy = dto.getVentasHoy();

        Double devolucionesVentaValorHoy =
                devolucionVentaRepository.calcularTotalEntre(
                        inicioHoy,
                        finHoy
                ).doubleValue();

        Double ventasNetasHoy =
                ventasBrutasHoy - devolucionesVentaValorHoy;

        Double utilidadBrutaHoy =
                ventasNetasHoy - costoVentasHoy;

        Double margenUtilidadHoy = 0.0;

        if (ventasNetasHoy > 0) {
            margenUtilidadHoy =
                    (utilidadBrutaHoy / ventasNetasHoy) * 100;
        }

        dto.setVentasHoy(ventasNetasHoy);
        dto.setCostoVentasHoy(costoVentasHoy);
        dto.setUtilidadBrutaHoy(utilidadBrutaHoy);
        dto.setMargenUtilidadHoy(margenUtilidadHoy);


        // Devoluciones de venta y compra
        dto.setDevolucionesCompraHoy(
                devolucionCompraRepository
                        .calcularCantidadEntre(inicioHoy, finHoy)
        );

        dto.setDevolucionesCompraHoy(
                devolucionCompraRepository.findAll().stream()
                        .filter(d -> d.getFecha().toLocalDate()
                                .equals(java.time.LocalDate.now()))
                        .mapToLong(d -> d.getCantidad())
                        .sum()
        );

        dto.setDevolucionesVentaHoy(
                devolucionVentaRepository
                        .calcularCantidadEntre(inicioHoy, finHoy)
        );

        dto.setValorDevolucionesVentaHoy(
                devolucionVentaRepository
                        .calcularTotalEntre(inicioHoy, finHoy)
                        .doubleValue()
        );

        dto.setValorDevolucionesCompraHoy(
                devolucionCompraRepository.findAll().stream()
                        .filter(d -> d.getFecha().toLocalDate()
                                .equals(java.time.LocalDate.now()))
                        .mapToDouble(d -> d.getValor())
                        .sum()
        );

        dto.setCuentasPorCobrar(
                fiadoRepository.calcularSaldoTotal(EstadoFiado.PENDIENTE)
                        .doubleValue()
        );

        try {

            Caja cajaActual = cajaService.obtenerCajaAbierta();

            CajaDetalleResponseDTO caja = cajaService.obtenerDetalle(cajaActual.getId());

            dto.setEstadoCaja(caja.getEstado());
            dto.setMontoInicialCaja(caja.getMontoInicial());
            dto.setVentasContadoCaja(caja.getVentasContado());
            dto.setAbonosFiadosCaja(caja.getAbonosFiados());
            dto.setMontoEsperadoCaja(caja.getMontoEsperado());
            dto.setMontoFinalCaja(caja.getMontoFinal());
            dto.setDiferenciaCaja(caja.getDiferencia());
            dto.setResultadoCaja(caja.getResultado());

        } catch (IllegalStateException e) {

            List<Caja> cajas = cajaRepository.findAllByOrderByFechaAperturaDesc();

            if (!cajas.isEmpty()) {

                Caja ultimaCaja = cajas.get(0);

                CajaDetalleResponseDTO caja = cajaService.obtenerDetalle(
                        ultimaCaja.getId()
                );

                dto.setEstadoCaja(caja.getEstado());
                dto.setMontoInicialCaja(caja.getMontoInicial());
                dto.setVentasContadoCaja(caja.getVentasContado());
                dto.setAbonosFiadosCaja(caja.getAbonosFiados());
                dto.setMontoEsperadoCaja(caja.getMontoEsperado());
                dto.setMontoFinalCaja(caja.getMontoFinal());
                dto.setDiferenciaCaja(caja.getDiferencia());
                dto.setResultadoCaja(caja.getResultado());

            } else {

                dto.setEstadoCaja("SIN_CAJA");
                dto.setMontoInicialCaja(BigDecimal.ZERO);
                dto.setVentasContadoCaja(BigDecimal.ZERO);
                dto.setAbonosFiadosCaja(BigDecimal.ZERO);
                dto.setMontoEsperadoCaja(BigDecimal.ZERO);
                dto.setMontoFinalCaja(BigDecimal.ZERO);
                dto.setDiferenciaCaja(BigDecimal.ZERO);
                dto.setResultadoCaja("SIN_CAJA");
            }
        }

        return dto;
    }
}