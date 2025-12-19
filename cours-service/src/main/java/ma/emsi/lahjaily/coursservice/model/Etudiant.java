package ma.emsi.lahjaily.coursservice.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collection;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Etudiant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    private String email;

    @ManyToMany(mappedBy = "etudiants")
    @JsonIgnore
    private Collection<Cours> cours;

    @PreRemove
    private void removeCoursFromEtudiant() {
        if (cours != null) {
            for (Cours c : cours) {
                c.getEtudiants().remove(this);
            }
        }
    }
}
