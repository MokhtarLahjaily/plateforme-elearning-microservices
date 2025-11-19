package ma.emsi.lahjaily.inscriptionservice.web;

import feign.FeignException;
import ma.emsi.lahjaily.inscriptionservice.clients.CoursServiceClient;
import ma.emsi.lahjaily.inscriptionservice.model.Inscription;
import ma.emsi.lahjaily.inscriptionservice.repositories.InscriptionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class InscriptionController {

    private final InscriptionRepository inscriptionRepository;
    private final CoursServiceClient coursServiceClient;

    public InscriptionController(InscriptionRepository inscriptionRepository, CoursServiceClient coursServiceClient) {
        this.inscriptionRepository = inscriptionRepository;
        this.coursServiceClient = coursServiceClient;
    }

    @PostMapping("/inscriptions")
    public ResponseEntity<Inscription> createInscription(@RequestBody Inscription inscription) {
        try {
            // Ces appels lèveront FeignException si le cours ou l'étudiant est introuvable (404)
            coursServiceClient.getEtudiantById(inscription.getEtudiantId());
            coursServiceClient.getCoursById(inscription.getCoursId());

            Inscription savedInscription = inscriptionRepository.save(inscription);
            return new ResponseEntity<>(savedInscription, HttpStatus.CREATED);

        } catch (FeignException.NotFound e) {
            // ID non trouvé dans cours-service -> C'est une erreur de validation client (400)
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        } catch (FeignException e) {
            // Erreur de dépendance (service down, 5xx)
            return new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);

        } catch (Exception e) {
            // Erreur locale imprévue
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
