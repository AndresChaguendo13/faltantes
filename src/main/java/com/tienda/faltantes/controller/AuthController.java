package com.tienda.faltantes.controller;

import com.tienda.faltantes.dto.request.LoginRequest;
import com.tienda.faltantes.dto.response.LoginResponse;
import com.tienda.faltantes.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(service.login(request));
    }
}