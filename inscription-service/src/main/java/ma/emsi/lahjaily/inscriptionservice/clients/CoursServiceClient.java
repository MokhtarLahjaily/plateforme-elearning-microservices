package ma.emsi.lahjaily.inscriptionservice.clients;

import ma.emsi.lahjaily.inscriptionservice.model.Cours;
import ma.emsi.lahjaily.inscriptionservice.model.Etudiant;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "cours-service")
public interface CoursServiceClient {

    @GetMapping("/api/courses/{id}")
    Cours getCoursById(@PathVariable Long id);

    @GetMapping("/api/students/{id}")
    Etudiant getEtudiantById(@PathVariable Long id);
}
