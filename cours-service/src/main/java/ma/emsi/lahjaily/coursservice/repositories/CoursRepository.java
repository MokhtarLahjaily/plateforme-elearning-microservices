package ma.emsi.lahjaily.coursservice.repositories;

import ma.emsi.lahjaily.coursservice.model.Cours;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path = "courses")
public interface CoursRepository extends JpaRepository<Cours, Long> {
}
