package com.fsalazar.api.financeinfo.service;

import com.fsalazar.api.financeinfo.domain.Client;
import com.fsalazar.api.financeinfo.dto.ClientRequest;
import com.fsalazar.api.financeinfo.dto.ClientResponse;
import com.fsalazar.api.financeinfo.exception.ResourceNotFoundException;
import com.fsalazar.api.financeinfo.repository.ClientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    @Transactional(readOnly = true)
    public List<ClientResponse> getAllClients() {
        return clientRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ClientResponse getClientById(Long id) {
        Client client = getClientEntity(id);
        return toResponse(client);
    }

    @Transactional
    public ClientResponse createClient(ClientRequest request) {
        Client client = new Client();
        applyRequest(client, request);
        Client saved = clientRepository.save(client);
        return toResponse(saved);
    }

    @Transactional
    public ClientResponse updateClient(Long id, ClientRequest request) {
        Client client = getClientEntity(id);
        applyRequest(client, request);
        Client saved = clientRepository.save(client);
        return toResponse(saved);
    }

    @Transactional
    public void deleteClient(Long id) {
        Client client = getClientEntity(id);
        clientRepository.delete(client);
    }

    private Client getClientEntity(Long id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with id " + id));
    }

    private void applyRequest(Client client, ClientRequest request) {
        client.setFirstName(request.firstName());
        client.setLastName(request.lastName());
        client.setEmail(request.email());
        client.setPhone(request.phone());
        client.setCity(request.city());
    }

    private ClientResponse toResponse(Client client) {
        return new ClientResponse(
                client.getClientId(),
                client.getFirstName(),
                client.getLastName(),
                client.getEmail(),
                client.getPhone(),
                client.getCity(),
                client.getCreatedAt()
        );
    }
}
