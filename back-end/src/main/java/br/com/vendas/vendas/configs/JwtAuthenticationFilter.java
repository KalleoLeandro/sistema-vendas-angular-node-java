package br.com.vendas.vendas.configs;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import br.com.vendas.vendas.exceptions.DefaultErrorException;
import br.com.vendas.vendas.utils.JwtUtils;
import io.jsonwebtoken.io.IOException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;
    
    private static final List<String> PUBLIC_URLS = List.of(
    	    "login",    	    
    	    "swagger-ui",
    	    "v3",
    	    "api-docs"
    	);

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String token = jwtUtils.resolveToken(request);        
        

        try {
        if (token != null && jwtUtils.validateToken(token) && !jwtUtils.isTokenExpired(token)) {
            String username = jwtUtils.getUsernameFromToken(token);
            String perfil = jwtUtils.getRolesFromToken(token);

            List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(perfil));

            UserDetails userDetails = new User(username, "", authorities);

            UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(userDetails, null, authorities);

            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
        }catch (Exception e) {
			throw new DefaultErrorException("Erro ao recuperar os dados do token", HttpStatus.INTERNAL_SERVER_ERROR);
			
		}
    }
    
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
    	String path = request.getRequestURI();    	
    	return PUBLIC_URLS.stream().anyMatch(path::contains);
    }


}
