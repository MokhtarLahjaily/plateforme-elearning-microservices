package ma.emsi.lahjaily.coursservice.repositories;

import ma.emsi.lahjaily.coursservice.model.Cours;
import ma.emsi.lahjaily.coursservice.projections.CourseProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

import java.util.List;

@RepositoryRestResource(path = "courses", collectionResourceRel = "courses", excerptProjection = CourseProjection.class)
public interface CoursRepository extends JpaRepository<Cours, Long> {

    @RestResource(path = "byStudent")
    List<Cours> findByEtudiants_Id(@Param("id") Long id);

    @RestResource(path = "byProfessor")
    List<Cours> findByProfesseur_Id(@Param("id") Long id);
}
