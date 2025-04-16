package br.com.vendas.vendas.configs;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;

import br.com.vendas.vendas.exceptions.DefaultErrorException;
import br.com.vendas.vendas.utils.JwtUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class JwtAuthenticationFilterTest {

    @InjectMocks
    private JwtAuthenticationFilter filter;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private FilterChain filterChain;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @BeforeEach
    void setup() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void deveAutenticarComTokenValido() throws Exception {
        String token = "valid-token";

        Mockito.when(request.getRequestURI()).thenReturn("/api/usuarios");
        Mockito.when(jwtUtils.resolveToken(request)).thenReturn(token);
        Mockito.when(jwtUtils.validateToken(token)).thenReturn(true);
        Mockito.when(jwtUtils.isTokenExpired(token)).thenReturn(false);
        Mockito.when(jwtUtils.getUsernameFromToken(token)).thenReturn("kalleo");
        Mockito.when(jwtUtils.getRolesFromToken(token)).thenReturn("ROLE_USER");

        filter.doFilterInternal(request, response, filterChain);

        Assertions.assertNotNull(SecurityContextHolder.getContext().getAuthentication());
        Assertions.assertEquals("kalleo", SecurityContextHolder.getContext().getAuthentication().getName());

        Mockito.verify(filterChain).doFilter(request, response);
    }

    @Test
    void naoDeveAutenticarQuandoTokenInvalido() throws Exception {
        Mockito.when(request.getRequestURI()).thenReturn("/api/usuarios");
        Mockito.when(jwtUtils.resolveToken(request)).thenReturn(null); // nenhum token

        filter.doFilterInternal(request, response, filterChain);

        Assertions.assertNull(SecurityContextHolder.getContext().getAuthentication());
        Mockito.verify(filterChain).doFilter(request, response);
    }

    @Test
    void deveLancarExcecaoQuandoJwtFalhar() throws Exception {
        Mockito.when(request.getRequestURI()).thenReturn("/api/usuarios");
        Mockito.when(jwtUtils.resolveToken(request)).thenReturn("token");
        Mockito.when(jwtUtils.validateToken("token")).thenThrow(new RuntimeException("falha"));

        DefaultErrorException ex = Assertions.assertThrows(DefaultErrorException.class, () -> {
            filter.doFilterInternal(request, response, filterChain);
        });

        Assertions.assertEquals("Erro ao recuperar os dados do token", ex.getMessage());
        Assertions.assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, ex.getStatus());
    }

    @Test
    void naoDeveFiltrarLogin() throws ServletException {
        Mockito.when(request.getRequestURI()).thenReturn("/api/login");

        boolean shouldNotFilter = filter.shouldNotFilter(request);
        Assertions.assertTrue(shouldNotFilter);
    }

    @Test
    void deveFiltrarOutrasRotas() throws ServletException {
        Mockito.when(request.getRequestURI()).thenReturn("/api/produtos");

        boolean shouldNotFilter = filter.shouldNotFilter(request);
        Assertions.assertFalse(shouldNotFilter);
    }
}
