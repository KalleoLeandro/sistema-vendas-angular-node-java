package br.com.vendas.vendas.exceptions;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import br.com.vendas.vendas.exceptions.schemas.DefaultErrorResponse;

@ControllerAdvice
public class GlobalExceptionHandler {    

	@ExceptionHandler(DefaultErrorException.class)
    public ResponseEntity<DefaultErrorResponse> handleDefaultError(DefaultErrorException ex) {
        DefaultErrorResponse response = new DefaultErrorResponse();
        response.setTimestamp(LocalDateTime.now());
        response.setMessage(ex.getMessage());
        response.setStatus(ex.getStatus().value());

        return ResponseEntity.status(ex.getStatus()).body(response);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidationExceptions(MethodArgumentNotValidException ex) {
        List<String> invalidFields = new ArrayList<>();
        
        ex.getBindingResult().getFieldErrors().forEach((error) -> {
            String fieldName = error.getField();
            String errorMessage = error.getDefaultMessage();
            invalidFields.add(fieldName + ": " + errorMessage);
        });
        
        ApiError apiError = new ApiError();
        apiError.setTimestamp(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        apiError.setStatus(HttpStatus.BAD_REQUEST.value());
        apiError.setError("Bad Request");
        apiError.setMessage("Erros de validação: " + invalidFields);     

        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }
}
