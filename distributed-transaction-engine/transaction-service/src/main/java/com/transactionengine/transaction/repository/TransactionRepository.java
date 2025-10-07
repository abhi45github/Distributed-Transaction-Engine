package com.transactionengine.transaction.repository;

import com.transactionengine.transaction.model.Transaction;
import com.transactionengine.transaction.model.Transaction.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Transaction Repository
 * Optimized queries for high-performance transaction processing
 */
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, String> {

    Optional<Transaction> findByTransactionId(String transactionId);

    boolean existsByTransactionIdAndStatusIn(String transactionId, List<TransactionStatus> statuses);

    List<Transaction> findByStatus(TransactionStatus status);

    List<Transaction> findByAccountFrom(String accountFrom);

    List<Transaction> findByAccountTo(String accountTo);

    @Query("SELECT t FROM Transaction t WHERE t.status = :status AND t.createdAt >= :startDate")
    List<Transaction> findTransactionsByStatusAndDateRange(
        @Param("status") TransactionStatus status,
        @Param("startDate") LocalDateTime startDate
    );

    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.status = :status AND t.createdAt >= :startTime")
    Long countTransactionsByStatusSince(
        @Param("status") TransactionStatus status,
        @Param("startTime") LocalDateTime startTime
    );

    @Query("SELECT t FROM Transaction t WHERE t.status = 'FAILED' AND t.retryCount < :maxRetries")
    List<Transaction> findFailedTransactionsForRetry(@Param("maxRetries") Integer maxRetries);

    @Query(value = "SELECT * FROM transactions WHERE status = 'PENDING' " +
                   "ORDER BY created_at ASC LIMIT :limit FOR UPDATE SKIP LOCKED",
           nativeQuery = true)
    List<Transaction> findAndLockPendingTransactions(@Param("limit") int limit);
}