package ma.emsi.lahjaily.coursservice.config;

import ma.emsi.lahjaily.coursservice.model.Cours;
import ma.emsi.lahjaily.coursservice.model.Etudiant;
import ma.emsi.lahjaily.coursservice.model.Professeur;
import ma.emsi.lahjaily.coursservice.projections.CourseProjection;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class RestConfig implements RepositoryRestConfigurer {

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        // Expose les IDs pour ces entités dans le JSON de réponse
        config.exposeIdsFor(Cours.class, Etudiant.class, Professeur.class);

        // Register projection
        config.getProjectionConfiguration().addProjection(CourseProjection.class);
    }
}