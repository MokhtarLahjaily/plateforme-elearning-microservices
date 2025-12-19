package ma.emsi.lahjaily.inscriptionservice.web;

import ma.emsi.lahjaily.inscriptionservice.clients.CoursServiceClient;
import ma.emsi.lahjaily.inscriptionservice.model.Inscription;
import ma.emsi.lahjaily.inscriptionservice.repositories.InscriptionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    @RequestMapping
    public List<Inscription> listInscriptions() {
        return inscriptionRepository.findTop5ByOrderByIdDesc();
    }

    @PostMapping("/inscriptions")
    public ResponseEntity<Inscription> createInscription(@RequestBody Inscription inscription) {
        // Ces appels lèveront FeignException si le cours ou l'étudiant est introuvable
        // (404)
        coursServiceClient.getEtudiantById(inscription.getEtudiantId());
        coursServiceClient.getCoursById(inscription.getCoursId());

        Inscription savedInscription = inscriptionRepository.save(inscription);
        log.info("Inscription created: studentId={}, courseId={}", inscription.getEtudiantId(),
                inscription.getCoursId());

        try {
            // Associer l'étudiant au cours dans le cours-service pour que ça s'affiche dans
            // les détails
            String studentUri = "http://localhost:8888/cours-service/api/students/" + inscription.getEtudiantId();
            coursServiceClient.addEtudiantToCourse(inscription.getCoursId(), studentUri);
            log.info("Association created in cours-service for studentUri: {}", studentUri);
        } catch (Exception e) {
            log.error("Failed to associate student to course in cours-service: {}", e.getMessage());
        }

        return new ResponseEntity<>(savedInscription, HttpStatus.CREATED);
    }
}
