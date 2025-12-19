package ma.emsi.lahjaily.inscriptionservice.clients;

import ma.emsi.lahjaily.inscriptionservice.model.Cours;
import ma.emsi.lahjaily.inscriptionservice.model.Etudiant;
import org.springframework.stereotype.Component;

@Component
public class CoursServiceClientFallback implements CoursServiceClient {

    @Override
    public Cours getCoursById(Long id) {
        // Retourne un cours "vide" ou par défaut pour éviter le crash
        Cours coursDefaut = new Cours();
        coursDefaut.setId(id);
        coursDefaut.setTitre("Cours non disponible");
        coursDefaut.setDescription("Le service de cours est temporairement inaccessible.");
        return coursDefaut;
    }

    @Override
    public Etudiant getEtudiantById(Long id) {
        // Retourne un étudiant "vide"
        Etudiant etudiantDefaut = new Etudiant();
        etudiantDefaut.setId(id);
        etudiantDefaut.setNom("Utilisateur Inconnu");
        etudiantDefaut.setEmail("inconnu@emsi.ma");
        return etudiantDefaut;
    }

    @Override
    public void addEtudiantToCourse(Long courseId, String studentUri) {
        // Log or do nothing
    }
}