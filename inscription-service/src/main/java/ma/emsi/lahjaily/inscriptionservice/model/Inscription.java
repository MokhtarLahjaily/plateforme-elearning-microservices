package ma.emsi.lahjaily.inscriptionservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "inscriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Inscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long etudiantId;
    private Long coursId;

    @Enumerated(EnumType.STRING)
    private InscriptionStatus statut;

    public enum InscriptionStatus {
        VALIDEE, EN_ATTENTE, ECHEC
    }
}
