package com.festaplanner.config;

import com.festaplanner.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailsService userDetailsService;
    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Público: autenticação, navegação sem login (catálogo, temas), console H2 para dev
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("GET", "/api/temas/**", "/api/produtos/**").permitAll()

                // Imagens enviadas pelo ADM ficam públicas (usadas no catálogo e no wizard do cliente)
                .requestMatchers("GET", "/uploads/**").permitAll()

                // "Meus Orçamentos" continua exigindo login (histórico do cliente cadastrado)
                .requestMatchers("GET", "/api/orcamentos/meus").authenticated()

                // Wizard de orçamento: permite fluxo de visitante, sem precisar logar
                .requestMatchers("POST", "/api/orcamentos").permitAll()
                .requestMatchers("PUT", "/api/orcamentos/*/tema/*").permitAll()
                .requestMatchers("POST", "/api/orcamentos/*/itens").permitAll()
                .requestMatchers("DELETE", "/api/orcamentos/*/itens/*").permitAll()
                .requestMatchers("POST", "/api/orcamentos/*/enviar").permitAll()
                .requestMatchers("POST", "/api/orcamentos/*/salvar-rascunho").permitAll()
                .requestMatchers("GET", "/api/orcamentos/*").permitAll()

                // Somente ADMINISTRADOR
                .requestMatchers("/api/admin/**").hasAuthority("ADMINISTRADOR")
                .requestMatchers("POST", "/api/produtos/**").hasAuthority("ADMINISTRADOR")
                .requestMatchers("PUT", "/api/produtos/**").hasAuthority("ADMINISTRADOR")
                .requestMatchers("DELETE", "/api/produtos/**").hasAuthority("ADMINISTRADOR")
                .requestMatchers("POST", "/api/uploads/**").hasAuthority("ADMINISTRADOR")

                // Demais rotas exigem usuário autenticado (cliente ou admin)
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin())); // necessário pro H2 console

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*")); // restrinja ao domínio do front em produção
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}