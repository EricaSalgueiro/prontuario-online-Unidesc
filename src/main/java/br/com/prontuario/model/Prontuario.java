package br.com.prontuario.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prontuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String descricao;

    private String diagnostico;

    private String prescricao;

    @Builder.Default
    private LocalDateTime dataRegistro = LocalDateTime.now();

    @ManyToOne
    private Paciente paciente;

    @ManyToOne
    private Medico medico;
}
