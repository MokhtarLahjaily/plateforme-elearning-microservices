package ma.emsi.lahjaily.inscriptionservice.repositories;

import ma.emsi.lahjaily.inscriptionservice.model.Inscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface InscriptionRepository extends JpaRepository<Inscription, Long> {
	List<Inscription> findTop5ByOrderByIdDesc();
}
