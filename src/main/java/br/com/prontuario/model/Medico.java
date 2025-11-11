package br.com.prontuario.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Medico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Column(unique = true, nullable = false)
    private String crm;

    @Enumerated(EnumType.STRING)
    private EspecialidadeMedica especialidade;

    private String telefone;

    @Builder.Default
    private LocalDateTime dataCadastro = LocalDateTime.now();
}
