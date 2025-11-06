package br.com.prontuario.service;

import br.com.prontuario.model.Prontuario;
import br.com.prontuario.model.Paciente;
import br.com.prontuario.model.Medico;
import br.com.prontuario.repository.ProntuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProntuarioService {

    private final ProntuarioRepository prontuarioRepository;

    public ProntuarioService(ProntuarioRepository prontuarioRepository) {
        this.prontuarioRepository = prontuarioRepository;
    }

    public List<Prontuario> listarTodos() {
        return prontuarioRepository.findAll();
    }

    public Optional<Prontuario> buscarPorId(Long id) {
        return prontuarioRepository.findById(id);
    }

    public List<Prontuario> buscarPorPaciente(Paciente paciente) {
        return prontuarioRepository.findByPaciente(paciente);
    }

    public List<Prontuario> buscarPorMedico(Medico medico) {
        return prontuarioRepository.findByMedico(medico);
    }

    public List<Prontuario> buscarPorDescricao(String descricao) {
        return prontuarioRepository.findByDescricaoContainingIgnoreCase(descricao);
    }

    public Prontuario salvar(Prontuario prontuario) {
        return prontuarioRepository.save(prontuario);
    }

    public Optional<Prontuario> atualizar(Long id, Prontuario prontuario) {
        return prontuarioRepository.findById(id).map(p -> {
            prontuario.setId(id);
            return prontuarioRepository.save(prontuario);
        });
    }

    public boolean deletar(Long id) {
        if (prontuarioRepository.existsById(id)) {
            prontuarioRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
