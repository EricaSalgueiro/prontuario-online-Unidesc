package br.com.prontuario.repository;

import br.com.prontuario.model.Prontuario;
import br.com.prontuario.model.Paciente;
import br.com.prontuario.model.Medico;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProntuarioRepository extends JpaRepository<Prontuario, Long> {
    // Buscar prontuários de um paciente específico
    List<Prontuario> findByPaciente(Paciente paciente);

    // Buscar prontuários de um médico específico
    List<Prontuario> findByMedico(Medico medico);

    // Buscar por descrição (palavra-chave no histórico)
    List<Prontuario> findByDescricaoContainingIgnoreCase(String descricao);
}
