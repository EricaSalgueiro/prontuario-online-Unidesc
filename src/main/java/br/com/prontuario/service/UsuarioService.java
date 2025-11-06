package br.com.prontuario.service;

import br.com.prontuario.model.Usuario;
import br.com.prontuario.model.TipoUsuario;
import br.com.prontuario.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    // 🔹 O Spring injeta automaticamente o PasswordEncoder configurado
    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // 🔹 Autenticação com BCrypt
    public Optional<Usuario> autenticarUsuario(String email, String senha) {
        return usuarioRepository.findByEmail(email)
                .filter(usuario -> passwordEncoder.matches(senha, usuario.getSenha()));
    }

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> buscarPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    public List<Usuario> listarAtivos() {
        return usuarioRepository.findByAtivoTrue();
    }

    public List<Usuario> listarPorTipo(TipoUsuario tipo) {
        return usuarioRepository.findByTipo(tipo);
    }

    // 🔹 Ao salvar, criptografa a senha
    public Usuario salvar(Usuario usuario) {
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        return usuarioRepository.save(usuario);
    }

    public Optional<Usuario> atualizar(Long id, Usuario usuario) {
        return usuarioRepository.findById(id).map(u -> {
            usuario.setId(id);
            return usuarioRepository.save(usuario);
        });
    }

    public boolean deletar(Long id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
