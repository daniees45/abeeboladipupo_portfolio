package com.portfolio.web.error;

import com.portfolio.web.dto.ProblemDetailDto;
import com.portfolio.web.dto.ProblemDetailDto.FieldErrorItem;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(Exceptions.ResourceNotFoundException.class)
    public ResponseEntity<ProblemDetailDto> handleNotFound(Exceptions.ResourceNotFoundException ex, HttpServletRequest request) {
        String requestId = getRequestId(request);
        ProblemDetailDto problem = ProblemDetailDto.of(
            HttpStatus.NOT_FOUND.value(),
            "Resource Not Found",
            ex.getMessage(),
            request.getRequestURI(),
            requestId,
            List.of()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .contentType(MediaType.APPLICATION_PROBLEM_JSON)
            .body(problem);
    }

    @ExceptionHandler({Exceptions.ResourceConflictException.class, OptimisticLockingFailureException.class})
    public ResponseEntity<ProblemDetailDto> handleConflict(Exception ex, HttpServletRequest request) {
        String requestId = getRequestId(request);
        String detail = ex instanceof OptimisticLockingFailureException
            ? "The resource was modified by another transaction. Please reload and retry."
            : ex.getMessage();

        ProblemDetailDto problem = ProblemDetailDto.of(
            HttpStatus.CONFLICT.value(),
            "Conflict / Optimistic Lock Failure",
            detail,
            request.getRequestURI(),
            requestId,
            List.of()
        );
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .contentType(MediaType.APPLICATION_PROBLEM_JSON)
            .body(problem);
    }

    @ExceptionHandler(Exceptions.RateLimitExceededException.class)
    public ResponseEntity<ProblemDetailDto> handleRateLimit(Exceptions.RateLimitExceededException ex, HttpServletRequest request) {
        String requestId = getRequestId(request);
        ProblemDetailDto problem = ProblemDetailDto.of(
            HttpStatus.TOO_MANY_REQUESTS.value(),
            "Rate Limit Exceeded",
            ex.getMessage(),
            request.getRequestURI(),
            requestId,
            List.of()
        );
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
            .contentType(MediaType.APPLICATION_PROBLEM_JSON)
            .body(problem);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ProblemDetailDto> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        String requestId = getRequestId(request);
        List<FieldErrorItem> fieldErrors = new ArrayList<>();
        for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.add(new FieldErrorItem(fe.getField(), fe.getDefaultMessage()));
        }

        ProblemDetailDto problem = ProblemDetailDto.of(
            HttpStatus.BAD_REQUEST.value(),
            "Validation Failed",
            "One or more submitted fields failed validation constraints.",
            request.getRequestURI(),
            requestId,
            fieldErrors
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .contentType(MediaType.APPLICATION_PROBLEM_JSON)
            .body(problem);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ProblemDetailDto> handleAccessDenied(AccessDeniedException ex, HttpServletRequest request) {
        String requestId = getRequestId(request);
        ProblemDetailDto problem = ProblemDetailDto.of(
            HttpStatus.FORBIDDEN.value(),
            "Forbidden",
            "Insufficient role privileges to perform this administrative operation.",
            request.getRequestURI(),
            requestId,
            List.of()
        );
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .contentType(MediaType.APPLICATION_PROBLEM_JSON)
            .body(problem);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ProblemDetailDto> handleUnauthorized(AuthenticationException ex, HttpServletRequest request) {
        String requestId = getRequestId(request);
        ProblemDetailDto problem = ProblemDetailDto.of(
            HttpStatus.UNAUTHORIZED.value(),
            "Unauthorized",
            ex.getMessage(),
            request.getRequestURI(),
            requestId,
            List.of()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .contentType(MediaType.APPLICATION_PROBLEM_JSON)
            .body(problem);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ProblemDetailDto> handleGeneric(Exception ex, HttpServletRequest request) {
        String requestId = getRequestId(request);
        log.error("Unhandled server exception for request [{}]", requestId, ex);
        ProblemDetailDto problem = ProblemDetailDto.of(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "Internal Server Error",
            "An unexpected internal error occurred. Please contact the administrator.",
            request.getRequestURI(),
            requestId,
            List.of()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .contentType(MediaType.APPLICATION_PROBLEM_JSON)
            .body(problem);
    }

    private String getRequestId(HttpServletRequest request) {
        String reqId = request.getHeader("X-Request-Id");
        return (reqId != null && !reqId.isBlank()) ? reqId : UUID.randomUUID().toString();
    }
}
