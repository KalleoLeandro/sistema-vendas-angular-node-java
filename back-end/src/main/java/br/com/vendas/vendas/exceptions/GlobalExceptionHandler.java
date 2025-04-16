package br.com.vendas.vendas.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@ControllerAdvice
public class GlobalExceptionHandler {    

    @ExceptionHandler(DefaultErrorException.class)
    public ResponseEntity<ErrorDetails> handleDefaultErrorException(DefaultErrorException ex, WebRequest request) {
        ErrorDetails errorDetails = new ErrorDetails(
                LocalDateTime.now(),
                ex.getMessage(),
                ex.getStatus().value()
        );
        return new ResponseEntity<>(errorDetails, ex.getStatus());
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidationExceptions(MethodArgumentNotValidException ex) {
        List<String> invalidFields = new ArrayList<>();

        // Adiciona os nomes dos campos inválidos à lista
        ex.getBindingResult().getFieldErrors().forEach((error) -> {
            String fieldName = error.getField();
            String errorMessage = error.getDefaultMessage();
            invalidFields.add(fieldName + ": " + errorMessage); // Campo e mensagem de erro
        });

        // Cria o objeto de resposta de erro formatado
        ApiError apiError = new ApiError();
        apiError.setTimestamp(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        apiError.setStatus(HttpStatus.BAD_REQUEST.value());
        apiError.setError("Bad Request");
        apiError.setMessage("Erros de validação: " + invalidFields); // Inclui os campos inválidos e suas mensagens        

        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }
}
