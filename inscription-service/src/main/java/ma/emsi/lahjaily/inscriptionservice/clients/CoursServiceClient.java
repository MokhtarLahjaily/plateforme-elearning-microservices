package ma.emsi.lahjaily.inscriptionservice.clients;

import ma.emsi.lahjaily.inscriptionservice.model.Cours;
import ma.emsi.lahjaily.inscriptionservice.model.Etudiant;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

// Ajout de l'attribut fallback
// The cours-service exposes its REST resources under /api (Spring Data REST base-path)
@FeignClient(name = "cours-service", path = "/api", fallback = CoursServiceClientFallback.class)
public interface CoursServiceClient {

    @GetMapping("/courses/{id}")
    Cours getCoursById(@PathVariable("id") Long id);

    @GetMapping("/students/{id}")
    Etudiant getEtudiantById(@PathVariable("id") Long id);

    @PostMapping(value = "/courses/{courseId}/etudiants", consumes = "text/uri-list")
    void addEtudiantToCourse(@PathVariable("courseId") Long courseId, String studentUri);
}