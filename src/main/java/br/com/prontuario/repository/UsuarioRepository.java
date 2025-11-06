package br.com.prontuario.repository;

import br.com.prontuario.model.Usuario;
import br.com.prontuario.model.TipoUsuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Buscar usuário pelo email (para login)
    Optional<Usuario> findByEmail(String email);

    // Listar todos os usuários ativos
    List<Usuario> findByAtivoTrue();

    // Buscar por tipo de usuário (ADMIN, MEDICO, PACIENTE)
    List<Usuario> findByTipo(TipoUsuario tipo);
}
