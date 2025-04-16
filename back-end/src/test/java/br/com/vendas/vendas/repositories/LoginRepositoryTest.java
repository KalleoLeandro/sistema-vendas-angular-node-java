package br.com.vendas.vendas.repositories;


import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.ActiveProfiles;

import br.com.vendas.vendas.exceptions.DefaultErrorException;
import br.com.vendas.vendas.models.dto.LoginDTO;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class LoginRepositoryTest {

    @InjectMocks
    private LoginRepository loginRepository;

    @Mock
    private DataSource dataSource;

    @Mock
    private Connection connection; 

    @Mock
    private PreparedStatement preparedStatement;

    @Mock
    private ResultSet resultSet;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testBuscarPorLoginESenha_Success() throws SQLException {
        // Setup dos mocks
        String login = "usuario-teste";
        String senha = "123";
        String sql = "SELECT * FROM usuarios WHERE login = ? and senha = ?";
        
        Mockito.when(dataSource.getConnection()).thenReturn(connection);
        Mockito.when(connection.prepareStatement(sql)).thenReturn(preparedStatement);
        Mockito.when(preparedStatement.executeQuery()).thenReturn(resultSet);
        Mockito.when(resultSet.next()).thenReturn(true);
        Mockito.when(resultSet.getString("nome")).thenReturn("Nome Teste");
        Mockito.when(resultSet.getString("cpf")).thenReturn("12345678901");
        Mockito.when(resultSet.getString("perfil")).thenReturn("user");

        
        LoginDTO result = loginRepository.buscarPorLoginESenha(login, senha);

        
        Assertions.assertNotNull(result);
        Assertions.assertEquals("Nome Teste", result.getNome());
        Assertions.assertEquals("12345678901", result.getCpf());
        Assertions.assertEquals("user", result.getPerfil());

        
        Mockito.verify(dataSource).getConnection();
        Mockito.verify(connection).prepareStatement(sql);
        Mockito.verify(preparedStatement).setString(1, login);
        Mockito.verify(preparedStatement).setString(2, senha);
        Mockito.verify(preparedStatement).executeQuery();
    }

    @Test
    void testBuscarPorLoginESenha_NotFound() throws SQLException {
        
        String login = "usuario-invalido";
        String senha = "senha-invalida";
        String sql = "SELECT * FROM usuarios WHERE login = ? and senha = ?";

        Mockito.when(dataSource.getConnection()).thenReturn(connection);
        Mockito.when(connection.prepareStatement(sql)).thenReturn(preparedStatement);
        Mockito.when(preparedStatement.executeQuery()).thenReturn(resultSet);
        Mockito.when(resultSet.next()).thenReturn(false);
        
        LoginDTO result = loginRepository.buscarPorLoginESenha(login, senha);


        Assertions.assertNull(result);

        Mockito.verify(dataSource).getConnection();
        Mockito.verify(connection).prepareStatement(sql);
        Mockito.verify(preparedStatement).setString(1, login);
        Mockito.verify(preparedStatement).setString(2, senha);
        Mockito.verify(preparedStatement).executeQuery();
    }

    @Test
    void testBuscarPorLoginESenha_Exception() throws SQLException {
       
        String login = "usuario-teste";
        String senha = "123";
        String sql = "SELECT * FROM usuarios WHERE login = ? and senha = ?";

        Mockito.when(dataSource.getConnection()).thenReturn(connection);
        Mockito.when(connection.prepareStatement(sql)).thenThrow(new SQLException("Erro na conexão"));
        
        DefaultErrorException exception = Assertions.assertThrows(DefaultErrorException.class, () -> {
            loginRepository.buscarPorLoginESenha(login, senha);
        });

        Assertions.assertEquals("Erro ao consultar os dados na base", exception.getMessage());
        Assertions.assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, exception.getStatus());
    }
}
