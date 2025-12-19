package ma.emsi.lahjaily.inscriptionservice.web;

import feign.FeignException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(FeignException.NotFound.class)
    public ResponseEntity<ErrorResponse> handleFeignNotFound(FeignException.NotFound ex) {
        log.warn("Remote resource not found: {}", ex.getMessage());
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(FeignException.class)
    public ResponseEntity<ErrorResponse> handleFeignException(FeignException ex) {
        log.error("Remote service error", ex);
        return buildResponse(HttpStatus.SERVICE_UNAVAILABLE, "Remote service unavailable");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        log.error("Unexpected error", ex);
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
    }

    private ResponseEntity<ErrorResponse> buildResponse(HttpStatus status, String message) {
        ErrorResponse payload = new ErrorResponse(Instant.now().toString(), message, status.value());
        return ResponseEntity.status(status).body(payload);
    }

    public static class ErrorResponse {
        private final String timestamp;
        private final String message;
        private final int status;

        public ErrorResponse(String timestamp, String message, int status) {
            this.timestamp = timestamp;
            this.message = message;
            this.status = status;
        }

        public String getTimestamp() {
            return timestamp;
        }

        public String getMessage() {
            return message;
        }

        public int getStatus() {
            return status;
        }
    }
}
