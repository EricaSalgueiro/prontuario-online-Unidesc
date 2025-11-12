package br.com.prontuario.repository;

import br.com.prontuario.model.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PacienteRepository extends JpaRepository<Paciente, Long> {

    // Buscar paciente por CPF
    Optional<Paciente> findByCpf(String cpf);

    List<Paciente> findByMedicoId(Long medicoId);

    // Buscar por nome contendo uma parte do texto (ex.: LIKE %nome%)
    List<Paciente> findByNomeContainingIgnoreCase(String nome);

    // Buscar pacientes pelo convênio
    List<Paciente> findByConvenio(String convenio);

    List<Paciente> findByMedicoNomeIgnoreCase(String nome);

}
