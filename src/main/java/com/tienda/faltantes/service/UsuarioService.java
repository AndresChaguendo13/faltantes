package com.tienda.faltantes.service;

import com.tienda.faltantes.dto.request.UsuarioRequestDTO;
import com.tienda.faltantes.dto.response.UsuarioResponseDTO;
import com.tienda.faltantes.entity.Rol;
import com.tienda.faltantes.entity.Usuario;
import com.tienda.faltantes.exception.RecursoDuplicadoException;
import com.tienda.faltantes.exception.RecursoNoEncontradoException;
import com.tienda.faltantes.repository.RolRepository;
import com.tienda.faltantes.repository.UsuarioRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.tienda.faltantes.dto.request.UsuarioUpdateRequestDTO;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository,
                          RolRepository rolRepository,
                          BCryptPasswordEncoder passwordEncoder) {

        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UsuarioResponseDTO guardar(UsuarioRequestDTO dto) {

        if (usuarioRepository.existsByUsername(dto.getUsername())) {
            throw new RecursoDuplicadoException("El usuario ya existe");
        }

        Rol rol = rolRepository.findByNombre(dto.getRol())
                .orElseThrow(() ->
                        new RecursoNoEncontradoException("Rol no encontrado"));

        Usuario usuario = new Usuario();

        usuario.setNombre(dto.getNombre());
        usuario.setUsername(dto.getUsername());

        // Contraseña encriptada
        usuario.setPassword(passwordEncoder.encode(dto.getPassword()));

        usuario.setRol(rol);

        Usuario guardado = usuarioRepository.save(usuario);

        UsuarioResponseDTO response = new UsuarioResponseDTO();

        response.setId(guardado.getId());
        response.setNombre(guardado.getNombre());
        response.setUsername(guardado.getUsername());
        response.setRol(guardado.getRol().getNombre());

        return response;
    }

    public UsuarioResponseDTO actualizar(Long id, UsuarioUpdateRequestDTO dto) {

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() ->
                        new RecursoNoEncontradoException("Usuario no encontrado"));

        if (dto.getUsername() != null
                && !dto.getUsername().equals(usuario.getUsername())
                && usuarioRepository.existsByUsernameAndIdNot(dto.getUsername(), id)) {

            throw new RecursoDuplicadoException(
                    "El username ya está en uso");
        }

        if (dto.getNombre() != null && !dto.getNombre().isBlank()) {
            usuario.setNombre(dto.getNombre());
        }

        if (dto.getUsername() != null && !dto.getUsername().isBlank()) {
            usuario.setUsername(dto.getUsername());
        }

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            usuario.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        if (dto.getRol() != null && !dto.getRol().isBlank()) {

            Rol rol = rolRepository.findByNombre(dto.getRol())
                    .orElseThrow(() ->
                            new RecursoNoEncontradoException("Rol no encontrado"));

            usuario.setRol(rol);
        }

        Usuario actualizado = usuarioRepository.save(usuario);

        UsuarioResponseDTO response = new UsuarioResponseDTO();

        response.setId(actualizado.getId());
        response.setNombre(actualizado.getNombre());
        response.setUsername(actualizado.getUsername());
        response.setRol(actualizado.getRol().getNombre());

        return response;
    }

    public List<UsuarioResponseDTO> listar() {

        return usuarioRepository.findAll()
                .stream()
                .map(usuario -> {
                    UsuarioResponseDTO response = new UsuarioResponseDTO();

                    response.setId(usuario.getId());
                    response.setNombre(usuario.getNombre());
                    response.setUsername(usuario.getUsername());
                    response.setRol(usuario.getRol().getNombre());

                    return response;
                })
                .toList();
    }

}