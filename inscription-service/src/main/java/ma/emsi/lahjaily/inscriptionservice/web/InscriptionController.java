package ma.emsi.lahjaily.inscriptionservice.web;

import ma.emsi.lahjaily.inscriptionservice.clients.CoursServiceClient;
import ma.emsi.lahjaily.inscriptionservice.model.Inscription;
import ma.emsi.lahjaily.inscriptionservice.repositories.InscriptionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class InscriptionController {

    private static final Logger log = LoggerFactory.getLogger(InscriptionController.class);

    private final InscriptionRepository inscriptionRepository;
    private final CoursServiceClient coursServiceClient;

    public InscriptionController(InscriptionRepository inscriptionRepository, CoursServiceClient coursServiceClient) {
        this.inscriptionRepository = inscriptionRepository;
        this.coursServiceClient = coursServiceClient;
    }

    @GetMapping("/inscriptions")
    public List<Inscription> listInscriptions() {
        return inscriptionRepository.findTop5ByOrderByIdDesc();
    }

    @PostMapping("/inscriptions")
    @Transactional
    public ResponseEntity<Inscription> createInscription(@RequestBody Inscription inscription) {
        // 1. Initial save with status EN_ATTENTE (Lifecycle management)
        inscription.setStatut(Inscription.InscriptionStatus.EN_ATTENTE);
        Inscription savedInscription = inscriptionRepository.save(inscription);

        try {
            // 2. Pre-validation: Check if student and course exist via Feign clients
            coursServiceClient.getEtudiantById(inscription.getEtudiantId());
            coursServiceClient.getCoursById(inscription.getCoursId());

            // 3. Dynamic Resolution: Use service-name 'cours-service' instead of localhost.
            // This complies with 12-factor apps by allowing the infrastructure (Eureka/K8s)
            // to resolve the location.
            String studentUri = "http://cours-service/api/students/" + inscription.getEtudiantId();

            // 4. Remote Association: Spring Data REST text/uri-list consumes this internal
            // resource URI
            coursServiceClient.addEtudiantToCourse(inscription.getCoursId(), studentUri);

            // 5. Final State transition
            savedInscription.setStatut(Inscription.InscriptionStatus.VALIDEE);
            log.info("Inscription finalized: id={}, studentId={}, coursId={}",
                    savedInscription.getId(), savedInscription.getEtudiantId(), savedInscription.getCoursId());

        } catch (Exception e) {
            // 6. Saga-ish pattern: Compensating action is marking as ECHEC instead of hard
            // rollback
            // This keeps an audit trail of failed attempts.
            log.error("Association failed for course {}: {}. Marking inscription as ECHEC.",
                    inscription.getCoursId(), e.getMessage());
            savedInscription.setStatut(Inscription.InscriptionStatus.ECHEC);
        }

        return new ResponseEntity<>(savedInscription, HttpStatus.CREATED);
    }
}
