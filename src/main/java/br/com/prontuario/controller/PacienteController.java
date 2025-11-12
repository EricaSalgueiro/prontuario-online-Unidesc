package br.com.prontuario.controller;

import br.com.prontuario.DTO.PacienteDTO;
import br.com.prontuario.model.Paciente;
import br.com.prontuario.service.PacienteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/pacientes")
public class PacienteController {

    private final PacienteService pacienteService;

    public PacienteController(PacienteService pacienteService) {
        this.pacienteService = pacienteService;
    }

    @GetMapping
    public ResponseEntity<List<PacienteDTO>> listarTodos() {
        return ResponseEntity.ok(pacienteService.listarTodosDTO());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PacienteDTO> buscarPorId(@PathVariable Long id) {
        return pacienteService.buscarPorId(id)
                .map(p -> ResponseEntity.ok(pacienteService.toDTO(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<PacienteDTO> buscarPorCpf(@PathVariable String cpf) {
        return pacienteService.buscarPorCpf(cpf)
                .map(p -> ResponseEntity.ok(pacienteService.toDTO(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/nome/{nome}")
    public ResponseEntity<List<PacienteDTO>> buscarPorNome(@PathVariable String nome) {
        List<Paciente> pacientes = pacienteService.buscarPorNome(nome);
        List<PacienteDTO> dto = pacientes.stream().map(pacienteService::toDTO).toList();
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/convenio/{convenio}")
    public ResponseEntity<List<PacienteDTO>> buscarPorConvenio(@PathVariable String convenio) {
        List<Paciente> pacientes = pacienteService.buscarPorConvenio(convenio);
        List<PacienteDTO> dto = pacientes.stream().map(pacienteService::toDTO).toList();
        return ResponseEntity.ok(dto);
    }

    // Lista pacientes pelo ID do médico
    @GetMapping("/medico/{medicoId}")
    public ResponseEntity<List<PacienteDTO>> listarPorMedico(@PathVariable Long medicoId) {
        List<PacienteDTO> pacientes = pacienteService.listarPorMedico(medicoId)
                .stream()
                .map(pacienteService::toDTO)
                .toList();

        return ResponseEntity.ok(pacientes);
    }

    // Lista pacientes pelo nome do médico
    @GetMapping("/medico/nome/{nome}")
    public ResponseEntity<List<PacienteDTO>> listarPorNomeMedico(@PathVariable String nome) {
        List<PacienteDTO> pacientes = pacienteService.listarPorNomeMedico(nome)
                .stream()
                .map(pacienteService::toDTO)
                .toList();

        return ResponseEntity.ok(pacientes);
    }

    @PostMapping
    public ResponseEntity<Paciente> salvar(@RequestBody Paciente paciente) {
        return ResponseEntity.ok(pacienteService.salvar(paciente));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Paciente> atualizar(@PathVariable Long id, @RequestBody Paciente paciente) {
        return pacienteService.atualizar(id, paciente)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        return pacienteService.deletar(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
