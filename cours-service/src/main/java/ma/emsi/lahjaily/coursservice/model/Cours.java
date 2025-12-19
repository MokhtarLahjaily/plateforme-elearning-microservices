package ma.emsi.lahjaily.coursservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collection;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cours {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String titre;
    private String description;
    private String contenu;
    private String niveau;

    @ManyToOne(fetch = FetchType.EAGER)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Professeur professeur;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "cours_etudiants", joinColumns = @JoinColumn(name = "cours_id"), inverseJoinColumns = @JoinColumn(name = "etudiants_id"))
    private Collection<Etudiant> etudiants;

    @PreRemove
    private void preRemove() {
        // Nettoyer manuellement les associations dans la table de jointure via JPA
        if (etudiants != null) {
            etudiants.clear();
        }
    }
}
