package br.com.prontuario.service;

import br.com.prontuario.model.Medico;
import br.com.prontuario.model.EspecialidadeMedica;
import br.com.prontuario.repository.MedicoRepository;
import lombok.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MedicoService {

    private final MedicoRepository medicoRepository;

    public MedicoService(MedicoRepository medicoRepository) {
        this.medicoRepository = medicoRepository;
    }

    public List<Medico> listarTodos() {
        return medicoRepository.findAll();
    }

    public Optional<Medico> buscarPorId(@NonNull Long id) {
        return medicoRepository.findById(id);
    }

    public Optional<Medico> buscarPorCrm(@NonNull String crm) {
        return medicoRepository.findByCrm(crm);
    }

    public List<Medico> buscarPorEspecialidade(@NonNull EspecialidadeMedica especialidade) {
        return medicoRepository.findByEspecialidade(especialidade);
    }

    public List<Medico> buscarPorNome(@NonNull String nome) {
        return medicoRepository.findByNomeContainingIgnoreCase(nome);
    }

    public Medico salvar(@NonNull Medico medico) {
        return medicoRepository.save(medico);
    }

    public Optional<Medico> atualizar(@NonNull Long id, @NonNull Medico medico) {
        return medicoRepository.findById(id).map(m -> {
            medico.setId(id);
            return medicoRepository.save(medico);
        });
    }

    public boolean deletar(@NonNull Long id) {
        if (medicoRepository.existsById(id)) {
            medicoRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
