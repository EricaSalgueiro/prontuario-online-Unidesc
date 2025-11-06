package br.com.prontuario.controller;

import br.com.prontuario.model.Usuario;
import br.com.prontuario.model.TipoUsuario;
import br.com.prontuario.service.UsuarioService;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController  // Indica que é um REST controller (retorna JSON)
@RequestMapping("/api/usuarios")  // Base path para todos os endpoints
public class UsuarioController {

    @Autowired  // Injeta o service
    private UsuarioService usuarioService;

    // 🔹 Listar todos os usuários (GET)
    @GetMapping
    public ResponseEntity<List<Usuario>> listarTodos() {
        List<Usuario> usuarios = usuarioService.listarTodos();
        return ResponseEntity.ok(usuarios);
    }

    // 🔹 Buscar por ID (GET)
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable Long id) {
        Optional<Usuario> usuario = usuarioService.buscarPorId(id);
        return usuario.map(u -> ResponseEntity.ok(u))
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔹 Buscar por email (GET)
    @GetMapping("/email/{email}")
    public ResponseEntity<Usuario> buscarPorEmail(@PathVariable String email) {
        Optional<Usuario> usuario = usuarioService.buscarPorEmail(email);
        return usuario.map(u -> ResponseEntity.ok(u))
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔹 Listar ativos (GET)
    @GetMapping("/ativos")
    public ResponseEntity<List<Usuario>> listarAtivos() {
        List<Usuario> usuarios = usuarioService.listarAtivos();
        return ResponseEntity.ok(usuarios);
    }

    // 🔹 Listar por tipo (GET)
    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<Usuario>> listarPorTipo(@PathVariable TipoUsuario tipo) {
        List<Usuario> usuarios = usuarioService.listarPorTipo(tipo);
        return ResponseEntity.ok(usuarios);
    }

    // 🔹 Criar usuário (POST) - Senha será criptografada automaticamente
    @PostMapping
    public ResponseEntity<Usuario> salvar(@RequestBody Usuario usuario) {
        Usuario salvo = usuarioService.salvar(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    // 🔹 Atualizar usuário (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizar(@PathVariable Long id, @RequestBody Usuario usuario) {
        Optional<Usuario> atualizado = usuarioService.atualizar(id, usuario);
        return atualizado.map(u -> ResponseEntity.ok(u))
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔹 Deletar usuário (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        boolean deletado = usuarioService.deletar(id);
        if (deletado) {
            return ResponseEntity.noContent().build();  // 204 No Content
        }
        return ResponseEntity.notFound().build();
    }

    // 🔹 Endpoint de Login Simples (POST) - Para testar autenticação
    // Retorna o usuário se autenticado, senão 401 Unauthorized
    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody LoginRequest request) {
        Optional<Usuario> usuario = usuarioService.autenticarUsuario(request.getEmail(), request.getSenha());
        return usuario.map(u -> ResponseEntity.ok(u))
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    // 🔹 Classe auxiliar para request de login (evita expor senha no Usuario model)
    @Getter
    public static class LoginRequest {
        // Getters e Setters
        private String email;
        private String senha;

        public void setEmail(String email) { this.email = email; }

        public void setSenha(String senha) { this.senha = senha; }
    }
}
