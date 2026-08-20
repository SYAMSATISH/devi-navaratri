package devi.security;

import devi.entity.User;
import devi.repository.UserRepository;
import devi.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collection;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserRepository userRepository) {

        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null
                && authHeader.startsWith("Bearer ")) {

            String token = authHeader.substring(7);

            try {
                String email = jwtService.extractEmail(token);

                if (email != null
                        && SecurityContextHolder.getContext()
                        .getAuthentication() == null) {

                    if (jwtService.isTokenValid(token)) {

                        User user = userRepository
                                .findByEmail(email)
                                .orElse(null);

                        if (user != null) {

                            Collection<GrantedAuthority> authorities;

                            if (user.getRole() != null
                                    && !user.getRole().isBlank()) {

                                authorities = Collections.singletonList(
                                        new SimpleGrantedAuthority(
                                                "ROLE_" + user.getRole()
                                        )
                                );

                            } else {
                                authorities = Collections.emptyList();
                            }

                            UsernamePasswordAuthenticationToken authentication =
                                    new UsernamePasswordAuthenticationToken(
                                            email,
                                            null,
                                            authorities
                                    );

                            SecurityContextHolder
                                    .getContext()
                                    .setAuthentication(authentication);
                        }
                    }
                }

            } catch (Exception e) {
                // Invalid token
            }
        }

        filterChain.doFilter(request, response);
    }
}