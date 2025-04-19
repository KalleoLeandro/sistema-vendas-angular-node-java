package br.com.vendas.vendas.repositories;


import java.sql.ResultSet;

import javax.sql.DataSource;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

import br.com.vendas.vendas.exceptions.DefaultErrorException;
import br.com.vendas.vendas.models.dto.LoginDTO;
import br.com.vendas.vendas.models.requests.CadastroLoginRequest;

@SpringBootTest
@ActiveProfiles("test")
@ExtendWith(MockitoExtension.class)	
class LoginRepositoryTest {

	@InjectMocks
	private LoginRepository loginRepository;

    @Mock
    private DataSource dataSource;
    
    @Mock
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    
    @SuppressWarnings("unchecked")
	@Test
    void testBuscarPorLoginESenha_Success() throws Exception {
        String login = "usuario-teste";
        String senha = "123";        

        Mockito.doAnswer(invocation -> {
            RowMapper<LoginDTO> rowMapper = invocation.getArgument(2);

            ResultSet rs = Mockito.mock(ResultSet.class);
            Mockito.when(rs.getString("nome")).thenReturn("Nome Teste");
            Mockito.when(rs.getString("cpf")).thenReturn("12345678901");
            Mockito.when(rs.getString("perfil")).thenReturn("user");

            return rowMapper.mapRow(rs, 1);
        }).when(namedParameterJdbcTemplate).queryForObject(
            Mockito.anyString(),            
            Mockito.any(MapSqlParameterSource.class),
            Mockito.any(RowMapper.class)
        );

        LoginDTO result = loginRepository.buscarPorLoginESenha(login, senha);

        Assertions.assertNotNull(result);
        Assertions.assertEquals("Nome Teste", result.getNome());
        Assertions.assertEquals("12345678901", result.getCpf());
        Assertions.assertEquals("user", result.getPerfil());
    }
    
    @SuppressWarnings("unchecked")
	@Test
    void testBuscarPorLoginESenha_NotFound() {
        String login = "usuario-invalido";
        String senha = "senha-invalida";        

        Mockito.when(namedParameterJdbcTemplate.queryForObject(
                Mockito.anyString(),
                Mockito.any(MapSqlParameterSource.class),
                Mockito.any(RowMapper.class)
        )).thenThrow(EmptyResultDataAccessException.class);
        
        LoginDTO result = loginRepository.buscarPorLoginESenha(login, senha);

        Assertions.assertNull(result);

        Mockito.verify(namedParameterJdbcTemplate).queryForObject(
                Mockito.anyString(),
                Mockito.any(MapSqlParameterSource.class),
                Mockito.any(RowMapper.class)
        );
    }


    @SuppressWarnings({ "unchecked", "serial" })
	@Test
    void testBuscarPorLoginESenha_Exception() {
        String login = "usuario-teste";
        String senha = "123";
        String sql = "SELECT nome, cpf, perfil FROM usuarios WHERE login = :login AND senha = :senha";
        
        Mockito.when(namedParameterJdbcTemplate.queryForObject(
            Mockito.eq(sql),
            Mockito.any(MapSqlParameterSource.class),
            Mockito.any(RowMapper.class)
        )).thenThrow(new DataAccessException("..."){ });

        
        DefaultErrorException ex = Assertions.assertThrows(DefaultErrorException.class, () -> {
            loginRepository.buscarPorLoginESenha(login, senha);
        });
        
        Assertions.assertEquals("Erro ao consultar os dados na base", ex.getMessage());
        Assertions.assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, ex.getStatus());
    }
    
    @Test
    void testCadastrarLogin_Success() throws Exception {
        CadastroLoginRequest cadastroLoginRequest = new CadastroLoginRequest("teste", "222.333.444-05", "teste_user", "123456", "dev");

        Mockito.when(namedParameterJdbcTemplate.update(
                Mockito.anyString(),
                Mockito.any(MapSqlParameterSource.class)
        )).thenReturn(1); 

        loginRepository.cadastrarLogin(cadastroLoginRequest);
        
        Mockito.verify(namedParameterJdbcTemplate).update(
                Mockito.anyString(),
                Mockito.any(MapSqlParameterSource.class)                
        );
    }    
    
	@SuppressWarnings("serial")
	@Test
    void testCadastrarLogin_Exception() {
		CadastroLoginRequest cadastroLoginRequest = new CadastroLoginRequest("teste", "222.333.444-05", "teste_user", "123456", "dev");
        
		Mockito.when(namedParameterJdbcTemplate.update(
                Mockito.anyString(),
                Mockito.any(MapSqlParameterSource.class)
        )).thenThrow(new DataAccessException("..."){ });
        
        DefaultErrorException ex = Assertions.assertThrows(DefaultErrorException.class, () -> {
        	loginRepository.cadastrarLogin(cadastroLoginRequest);
        });
        
        Assertions.assertEquals("Erro ao gravar os dados na base", ex.getMessage());
        Assertions.assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, ex.getStatus());
    }
}
