package com.festaplanner.service;

import com.festaplanner.dto.AtualizarPerfilRequest;
import com.festaplanner.model.Usuario;
import com.festaplanner.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UsuarioService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + email));

        return new User(
                usuario.getEmail(),
                usuario.getSenhaHash() == null ? "" : usuario.getSenhaHash(),
                java.util.List.of(new SimpleGrantedAuthority(usuario.getPerfil().name()))
        );
    }

    public Usuario buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + email));
    }

    /** Usado pela tela "Sua conta" (cliente) e pela edição de perfil do ADM — atualiza nome/telefone. */
    @Transactional
    public Usuario atualizarPerfil(String email, AtualizarPerfilRequest request) {
        Usuario usuario = buscarPorEmail(email);
        usuario.setNome(request.getNome());
        usuario.setTelefone(request.getTelefone());
        return usuarioRepository.save(usuario);
    }
}