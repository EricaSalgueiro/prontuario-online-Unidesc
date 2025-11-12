package br.com.prontuario.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import br.com.prontuario.model.Paciente;

@Data
@AllArgsConstructor
public class PacienteDTO {

    private Long id;
    private String nome;
    private String cpf;
    private String convenio;
    private String nomeMedico; // mostra o nome do médico responsável

    // Construtor que aceita um Paciente
    public PacienteDTO(Paciente paciente) {
        this.id = paciente.getId();
        this.nome = paciente.getNome();
        this.cpf = paciente.getCpf();
        this.convenio = paciente.getConvenio();
        this.nomeMedico = paciente.getMedico() != null ? paciente.getMedico().getNome() : null;
    }
}
