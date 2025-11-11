package br.com.prontuario.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Column(unique = true, nullable = false)
    private String email;

    private String senha;

    @Enumerated(EnumType.STRING)
    private TipoUsuario tipo; // ADMIN, MEDICO, PACIENTE

    @Builder.Default
    private boolean ativo = true;

    @Builder.Default
    private LocalDateTime criadoEm = LocalDateTime.now();
}
