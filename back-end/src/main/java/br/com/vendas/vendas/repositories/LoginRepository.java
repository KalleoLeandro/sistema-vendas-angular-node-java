package br.com.vendas.vendas.repositories;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;

import br.com.vendas.vendas.exceptions.DefaultErrorException;
import br.com.vendas.vendas.models.dto.LoginDTO;

@Repository
public class LoginRepository {
	
	private static final Logger logger = LoggerFactory.getLogger(LoginRepository.class);

    @Autowired
    private DataSource dataSource;

    public LoginDTO buscarPorLoginESenha(String login, String senha) {
        String sql = "SELECT * FROM usuarios WHERE login = ? and senha = ?";
        LoginDTO dto = null;
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {        	
            stmt.setString(1, login);
            stmt.setString(2, senha);
            logger.info("Executando a query para buscar por login e senha");
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                dto = new LoginDTO(rs.getString("nome"), rs.getString("cpf"), rs.getString("perfil"));
            }
        return dto;
        }catch (SQLException e) {
        	logger.error(e.getMessage());
        	throw new DefaultErrorException("Erro ao consultar os dados na base", HttpStatus.INTERNAL_SERVER_ERROR);
		}		    
    }
}
