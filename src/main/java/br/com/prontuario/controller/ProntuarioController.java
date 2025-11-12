package br.com.prontuario.controller;

import br.com.prontuario.model.Prontuario;
import br.com.prontuario.model.Paciente;
import br.com.prontuario.model.Medico;
import br.com.prontuario.service.ProntuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/prontuarios")
public class ProntuarioController {

    private final ProntuarioService prontuarioService;

    public ProntuarioController(ProntuarioService prontuarioService) {
        this.prontuarioService = prontuarioService;
    }

    @GetMapping
    public ResponseEntity<List<Prontuario>> listarTodos() {
        return ResponseEntity.ok(prontuarioService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prontuario> buscarPorId(@PathVariable Long id) {
        return prontuarioService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<List<Prontuario>> buscarPorPaciente(@PathVariable Long idPaciente) {
        Paciente paciente = new Paciente();
        paciente.setId(idPaciente);
        return ResponseEntity.ok(prontuarioService.buscarPorPaciente(paciente));
    }

    @GetMapping("/medico/{idMedico}")
    public ResponseEntity<List<Prontuario>> buscarPorMedico(@PathVariable Long idMedico) {
        Medico medico = new Medico();
        medico.setId(idMedico);
        return ResponseEntity.ok(prontuarioService.buscarPorMedico(medico));
    }

    @GetMapping("/descricao/{texto}")
    public ResponseEntity<List<Prontuario>> buscarPorDescricao(@PathVariable String texto) {
        return ResponseEntity.ok(prontuarioService.buscarPorDescricao(texto));
    }

    @PostMapping
    public ResponseEntity<Prontuario> salvar(@RequestBody Prontuario prontuario) {
        return ResponseEntity.ok(prontuarioService.salvar(prontuario));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Prontuario> atualizar(@PathVariable Long id, @RequestBody Prontuario prontuario) {
        return prontuarioService.atualizar(id, prontuario)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        return prontuarioService.deletar(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
