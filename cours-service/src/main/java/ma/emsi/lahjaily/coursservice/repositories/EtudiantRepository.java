package ma.emsi.lahjaily.coursservice.repositories;

import ma.emsi.lahjaily.coursservice.model.Etudiant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface EtudiantRepository extends JpaRepository<Etudiant, Long> {
}
