package com.transactionengine.transaction.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;
import java.util.function.Supplier;

/**
 * Distributed Lock Service using Redis
 *
 * Ensures transaction integrity across multiple instances
 * Prevents duplicate processing and race conditions
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class DistributedLockService {

    private final RedissonClient redissonClient;

    @Value("${distributed.lock.wait-time:10}")
    private long lockWaitTime;

    @Value("${distributed.lock.lease-time:30}")
    private long lockLeaseTime;

    /**
     * Execute action with distributed lock
     *
     * @param lockKey Unique key for the lock
     * @param action Action to execute under lock
     * @return Result of the action
     */
    public <T> T executeWithLock(String lockKey, Supplier<T> action) {
        RLock lock = redissonClient.getLock(lockKey);
        boolean isLocked = false;

        try {
            log.debug("Attempting to acquire lock for key: {}", lockKey);
            isLocked = lock.tryLock(lockWaitTime, lockLeaseTime, TimeUnit.SECONDS);

            if (isLocked) {
                log.debug("Lock acquired successfully for key: {}", lockKey);
                return action.get();
            } else {
                log.warn("Failed to acquire lock for key: {} within {} seconds",
                    lockKey, lockWaitTime);
                throw new LockAcquisitionException(
                    "Could not acquire lock for key: " + lockKey);
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Thread interrupted while acquiring lock for key: {}", lockKey, e);
            throw new LockAcquisitionException(
                "Thread interrupted while acquiring lock", e);
        } finally {
            if (isLocked && lock.isHeldByCurrentThread()) {
                try {
                    lock.unlock();
                    log.debug("Lock released successfully for key: {}", lockKey);
                } catch (Exception e) {
                    log.error("Error releasing lock for key: {}", lockKey, e);
                }
            }
        }
    }

    /**
     * Execute action with distributed lock and custom timeout
     */
    public <T> T executeWithLock(String lockKey, long waitTime,
                                  long leaseTime, TimeUnit unit, Supplier<T> action) {
        RLock lock = redissonClient.getLock(lockKey);
        boolean isLocked = false;

        try {
            isLocked = lock.tryLock(waitTime, leaseTime, unit);
            if (isLocked) {
                return action.get();
            } else {
                throw new LockAcquisitionException(
                    "Could not acquire lock for key: " + lockKey);
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new LockAcquisitionException(
                "Thread interrupted while acquiring lock", e);
        } finally {
            if (isLocked && lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }

    /**
     * Check if a lock is currently held
     */
    public boolean isLocked(String lockKey) {
        RLock lock = redissonClient.getLock(lockKey);
        return lock.isLocked();
    }

    /**
     * Force unlock a lock (use with caution)
     */
    public void forceUnlock(String lockKey) {
        RLock lock = redissonClient.getLock(lockKey);
        if (lock.isLocked()) {
            lock.forceUnlock();
            log.warn("Force unlocked key: {}", lockKey);
        }
    }

    /**
     * Custom exception for lock acquisition failures
     */
    public static class LockAcquisitionException extends RuntimeException {
        public LockAcquisitionException(String message) {
            super(message);
        }

        public LockAcquisitionException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}