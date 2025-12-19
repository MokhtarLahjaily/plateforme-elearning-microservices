package ma.emsi.lahjaily.coursservice;

import ma.emsi.lahjaily.coursservice.model.Cours;
import ma.emsi.lahjaily.coursservice.model.Etudiant;
import ma.emsi.lahjaily.coursservice.model.Professeur;
import ma.emsi.lahjaily.coursservice.repositories.CoursRepository;
import ma.emsi.lahjaily.coursservice.repositories.EtudiantRepository;
import ma.emsi.lahjaily.coursservice.repositories.ProfesseurRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;

@SpringBootApplication
public class CoursServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(CoursServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner start(CoursRepository coursRepository,
            EtudiantRepository etudiantRepository,
            ProfesseurRepository professeurRepository) {
        return args -> {
            // Create Professeurs
            Professeur prof1 = new Professeur(null, "John Doe", "john.doe@emsi.ma", null);
            Professeur prof2 = new Professeur(null, "Sarah Connor", "sarah.connor@emsi.ma", null);
            List<Professeur> savedProfs = professeurRepository.saveAll(List.of(prof1, prof2));
            Professeur savedProf1 = savedProfs.get(0);
            Professeur savedProf2 = savedProfs.get(1);

            // Create Etudiants
            Etudiant etudiant1 = new Etudiant(null, "Alice Smith", "alice.smith@emsi.ma", null);
            Etudiant etudiant2 = new Etudiant(null, "Bob Johnson", "bob.johnson@emsi.ma", null);
            Etudiant etudiant3 = new Etudiant(null, "Carlos Diaz", "carlos.diaz@emsi.ma", null);
            List<Etudiant> savedEtudiants = etudiantRepository.saveAll(List.of(etudiant1, etudiant2, etudiant3));
            Etudiant savedEtudiant1 = savedEtudiants.get(0);
            Etudiant savedEtudiant2 = savedEtudiants.get(1);
            Etudiant savedEtudiant3 = savedEtudiants.get(2);

            // Create Cours
            Cours cours1 = new Cours(null, "Introduction to Spring Boot", "A comprehensive course on Spring Boot",
                    "Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications.",
                    "Debutant", savedProf1, List.of(savedEtudiant1, savedEtudiant2));
            Cours cours2 = new Cours(null, "Angular pour débutants", "Apprenez Angular pas à pas.",
                    "Master Angular 14 calls and build amazing apps.", "Intermediaire", savedProf2,
                    List.of(savedEtudiant2));
            Cours cours3 = new Cours(null, "Microservices avec Spring Cloud", "Patterns et pratiques pour le cloud.",
                    "Build cloud-native apps using Spring Cloud.", "Avance", savedProf1,
                    List.of(savedEtudiant1, savedEtudiant3));
            coursRepository.saveAll(List.of(cours1, cours2, cours3));
        };
    }
}
