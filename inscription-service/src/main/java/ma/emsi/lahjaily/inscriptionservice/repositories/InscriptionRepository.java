package ma.emsi.lahjaily.inscriptionservice.repositories;

import ma.emsi.lahjaily.inscriptionservice.model.Inscription;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InscriptionRepository extends JpaRepository<Inscription, Long> {
}
