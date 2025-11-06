package br.com.prontuario.repository;

import br.com.prontuario.model.Medico;
import br.com.prontuario.model.EspecialidadeMedica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicoRepository extends JpaRepository<Medico, Long> {
    // Buscar médico pelo CRM
    Optional<Medico> findByCrm(String crm);

    // Buscar médicos por especialidade
    List<Medico> findByEspecialidade(EspecialidadeMedica especialidade);

    // Buscar médicos pelo nome
    List<Medico> findByNomeContainingIgnoreCase(String nome);
}
