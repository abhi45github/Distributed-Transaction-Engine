package com.transactionengine.transaction.controller;

import com.transactionengine.transaction.dto.TransactionRequest;
import com.transactionengine.transaction.dto.TransactionResponse;
import com.transactionengine.transaction.model.Transaction;
import com.transactionengine.transaction.service.TransactionProcessingService;
import com.transactionengine.transaction.repository.TransactionRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

/**
 * Transaction Controller
 * REST API endpoints for transaction processing
 */
@RestController
@RequestMapping("/api/v1/transactions")
@Tag(name = "Transaction API", description = "High-performance transaction processing endpoints")
@Slf4j
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionProcessingService transactionService;
    private final TransactionRepository transactionRepository;

    /**
     * Create and process a new transaction
     */
    @PostMapping
    @Operation(summary = "Create transaction", description = "Process a new transaction with distributed locking")
    public ResponseEntity<TransactionResponse> createTransaction(
            @Valid @RequestBody TransactionRequest request) {

        log.info("Received transaction request: {}", request);

        Transaction transaction = Transaction.builder()
            .transactionId(generateTransactionId())
            .accountFrom(request.getAccountFrom())
            .accountTo(request.getAccountTo())
            .amount(request.getAmount())
            .currency(request.getCurrency())
            .type(request.getType())
            .description(request.getDescription())
            .metadata(request.getMetadata())
            .build();

        Transaction processed = transactionService.processTransaction(transaction);

        return ResponseEntity.ok(toResponse(processed));
    }

    /**
     * Process transaction asynchronously
     */
    @PostMapping("/async")
    @Operation(summary = "Create async transaction", description = "Process transaction asynchronously for high throughput")
    public ResponseEntity<CompletableFuture<TransactionResponse>> createTransactionAsync(
            @Valid @RequestBody TransactionRequest request) {

        Transaction transaction = Transaction.builder()
            .transactionId(generateTransactionId())
            .accountFrom(request.getAccountFrom())
            .accountTo(request.getAccountTo())
            .amount(request.getAmount())
            .currency(request.getCurrency())
            .type(request.getType())
            .description(request.getDescription())
            .build();

        CompletableFuture<TransactionResponse> future = transactionService
            .processTransactionAsync(transaction)
            .thenApply(this::toResponse);

        return ResponseEntity.accepted().body(future);
    }

    /**
     * Process batch transactions
     */
    @PostMapping("/batch")
    @Operation(summary = "Process batch transactions", description = "Process multiple transactions in batch")
    public ResponseEntity<CompletableFuture<List<TransactionResponse>>> processBatchTransactions(
            @Valid @RequestBody List<TransactionRequest> requests) {

        Transaction[] transactions = requests.stream()
            .map(req -> Transaction.builder()
                .transactionId(generateTransactionId())
                .accountFrom(req.getAccountFrom())
                .accountTo(req.getAccountTo())
                .amount(req.getAmount())
                .currency(req.getCurrency())
                .type(req.getType())
                .description(req.getDescription())
                .build())
            .toArray(Transaction[]::new);

        CompletableFuture<List<TransactionResponse>> future = transactionService
            .processBatchTransactions(transactions)
            .thenApply(results -> java.util.Arrays.stream(results)
                .map(this::toResponse)
                .collect(Collectors.toList()));

        return ResponseEntity.accepted().body(future);
    }

    /**
     * Get transaction by ID
     */
    @GetMapping("/{transactionId}")
    @Operation(summary = "Get transaction", description = "Retrieve transaction by ID")
    public ResponseEntity<TransactionResponse> getTransaction(@PathVariable String transactionId) {
        return transactionRepository.findByTransactionId(transactionId)
            .map(this::toResponse)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get transactions by account
     */
    @GetMapping("/account/{accountId}")
    @Operation(summary = "Get account transactions", description = "Retrieve all transactions for an account")
    public ResponseEntity<List<TransactionResponse>> getAccountTransactions(@PathVariable String accountId) {
        List<Transaction> transactions = transactionRepository.findByAccountFrom(accountId);
        transactions.addAll(transactionRepository.findByAccountTo(accountId));

        List<TransactionResponse> responses = transactions.stream()
            .map(this::toResponse)
            .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    /**
     * Get transaction metrics
     */
    @GetMapping("/metrics")
    @Operation(summary = "Get metrics", description = "Get current transaction processing metrics")
    public ResponseEntity<TransactionMetrics> getMetrics() {
        TransactionMetrics metrics = new TransactionMetrics();
        metrics.setCurrentTPS(transactionService.getCurrentTPS());
        metrics.setTransactionsByType(transactionService.getTransactionMetrics());
        return ResponseEntity.ok(metrics);
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Check service health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Transaction Service is running - Ready for 10,000+ TPS!");
    }

    private String generateTransactionId() {
        return "TXN-" + UUID.randomUUID().toString().toUpperCase().replace("-", "");
    }

    private TransactionResponse toResponse(Transaction transaction) {
        return TransactionResponse.builder()
            .transactionId(transaction.getTransactionId())
            .accountFrom(transaction.getAccountFrom())
            .accountTo(transaction.getAccountTo())
            .amount(transaction.getAmount())
            .currency(transaction.getCurrency())
            .type(transaction.getType())
            .status(transaction.getStatus())
            .description(transaction.getDescription())
            .createdAt(transaction.getCreatedAt())
            .completedAt(transaction.getCompletedAt())
            .failureReason(transaction.getFailureReason())
            .build();
    }

    @lombok.Data
    public static class TransactionMetrics {
        private double currentTPS;
        private java.util.concurrent.ConcurrentHashMap<String, java.util.concurrent.atomic.AtomicInteger> transactionsByType;
    }
}