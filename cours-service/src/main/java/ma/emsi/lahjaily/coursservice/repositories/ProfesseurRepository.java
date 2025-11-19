package ma.emsi.lahjaily.coursservice.repositories;

import ma.emsi.lahjaily.coursservice.model.Professeur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path = "professors")
public interface ProfesseurRepository extends JpaRepository<Professeur, Long> {
}
