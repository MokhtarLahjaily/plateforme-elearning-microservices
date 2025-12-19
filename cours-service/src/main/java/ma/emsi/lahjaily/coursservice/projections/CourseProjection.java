package ma.emsi.lahjaily.coursservice.projections;

import ma.emsi.lahjaily.coursservice.model.Cours;
import ma.emsi.lahjaily.coursservice.model.Etudiant;
import ma.emsi.lahjaily.coursservice.model.Professeur;
import org.springframework.data.rest.core.config.Projection;

import java.util.Collection;

@Projection(name = "fullCourse", types = { Cours.class })
public interface CourseProjection {
    Long getId();

    String getTitre();

    String getDescription();

    String getContenu();

    String getNiveau();

    Professeur getProfesseur();

    Collection<Etudiant> getEtudiants();
}
