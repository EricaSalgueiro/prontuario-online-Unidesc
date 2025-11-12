package br.com.prontuario.service;

import br.com.prontuario.DTO.PacienteDTO;
import br.com.prontuario.model.Paciente;
import br.com.prontuario.model.Usuario;
import br.com.prontuario.repository.PacienteRepository;
import br.com.prontuario.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PacienteService {

    private final PacienteRepository pacienteRepository;
    private final UsuarioRepository usuarioRepository;

    public PacienteService(PacienteRepository pacienteRepository, UsuarioRepository usuarioRepository) {
        this.pacienteRepository = pacienteRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<Paciente> listarTodos() {
        return pacienteRepository.findAll();
    }

    public List<PacienteDTO> listarTodosDTO() {
        return pacienteRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    public Optional<Paciente> buscarPorId(Long id) {
        return pacienteRepository.findById(id);
    }

    public Optional<Paciente> buscarPorCpf(String cpf) {
        return pacienteRepository.findByCpf(cpf);
    }

    public List<Paciente> buscarPorNome(String nome) {
        return pacienteRepository.findByNomeContainingIgnoreCase(nome);
    }

    public List<Paciente> buscarPorConvenio(String convenio) {
        return pacienteRepository.findByConvenio(convenio);
    }

    // Busca pacientes pelo ID do médico
    public List<Paciente> listarPorMedico(Long medicoId) {
        return pacienteRepository.findByMedicoId(medicoId);
    }

    // Busca pacientes pelo nome do médico
    public List<Paciente> listarPorNomeMedico(String nomeMedico) {
        Optional<Usuario> medico = usuarioRepository.findByNomeIgnoreCase(nomeMedico);
        return medico.map(m -> pacienteRepository.findByMedicoId(m.getId()))
                .orElse(List.of());
    }

    public Paciente salvar(Paciente paciente) {
        return pacienteRepository.save(paciente);
    }

    public Optional<Paciente> atualizar(Long id, Paciente paciente) {
        return pacienteRepository.findById(id).map(p -> {
            paciente.setId(id);
            return pacienteRepository.save(paciente);
        });
    }

    public boolean deletar(Long id) {
        if (pacienteRepository.existsById(id)) {
            pacienteRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Converte entidade para DTO
    public PacienteDTO toDTO(Paciente paciente) {
        return new PacienteDTO(paciente);
    }
}
