package br.com.prontuario.controller;

import br.com.prontuario.model.Usuario;
import br.com.prontuario.model.TipoUsuario;
import br.com.prontuario.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario usuario) {
        return usuarioService.autenticarUsuario(usuario.getEmail(), usuario.getSenha())
                .map(u -> {
                    // Retorna tipo de usuário junto com a mensagem
                    return ResponseEntity.ok(new LoginResponse(
                            "Login bem-sucedido",
                            u.getTipo()
                    ));
                })
                .orElseGet(() -> ResponseEntity.status(401)
                .body(new LoginResponse("Credenciais inválidas", null)));
    }

    // Classe interna para a resposta do login
    static class LoginResponse {

        private String mensagem;
        private TipoUsuario tipoUsuario;

        public LoginResponse(String mensagem, TipoUsuario tipoUsuario) {
            this.mensagem = mensagem;
            this.tipoUsuario = tipoUsuario;
        }

        public String getMensagem() {
            return mensagem;
        }

        public TipoUsuario getTipoUsuario() {
            return tipoUsuario;
        }
    }
}
