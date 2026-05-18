package com.fsalazar.api.financeinfo.repository;

import com.fsalazar.api.financeinfo.domain.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByEmailIgnoreCase(String email);
}
