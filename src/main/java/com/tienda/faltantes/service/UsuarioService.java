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
}