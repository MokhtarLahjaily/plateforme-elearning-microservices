package ma.emsi.lahjaily.inscriptionservice.web;

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
        // Validate that the student and course exist
        try {
            if (coursServiceClient.getEtudiantById(inscription.getEtudiantId()) == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            if (coursServiceClient.getCoursById(inscription.getCoursId()) == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            // Feign might throw an exception if the service is down or returns 404
            e.printStackTrace(); // Log the full exception
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Inscription savedInscription = inscriptionRepository.save(inscription);
        return new ResponseEntity<>(savedInscription, HttpStatus.CREATED);
    }
}
