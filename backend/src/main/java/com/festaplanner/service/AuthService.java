package com.festaplanner.service;

import com.festaplanner.dto.AuthResponse;
import com.festaplanner.dto.LoginRequest;
import com.festaplanner.dto.RegistroRequest;
import com.festaplanner.model.Perfil;
import com.festaplanner.model.ProvedorLogin;
import com.festaplanner.model.Usuario;
import com.festaplanner.repository.UsuarioRepository;
import com.festaplanner.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UsuarioService usuarioService;
    private final JwtUtil jwtUtil;

    public AuthResponse registrar(RegistroRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe um usuário com este e-mail");
        }

        Usuario usuario = Usuario.builder()
                .nome(request.getNome())
                .email(request.getEmail())
                .senhaHash(passwordEncoder.encode(request.getSenha()))
                .telefone(request.getTelefone())
                .perfil(request.getPerfil() != null ? request.getPerfil() : Perfil.CLIENTE)
                .provedorLogin(ProvedorLogin.EMAIL)
                .build();

        usuarioRepository.save(usuario);

        UserDetails userDetails = usuarioService.loadUserByUsername(usuario.getEmail());
        String token = jwtUtil.gerarToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .usuarioId(usuario.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .perfil(usuario.getPerfil().name())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getSenha())
        );

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas"));

        UserDetails userDetails = usuarioService.loadUserByUsername(usuario.getEmail());
        String token = jwtUtil.gerarToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .usuarioId(usuario.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .perfil(usuario.getPerfil().name())
                .build();
    }
}