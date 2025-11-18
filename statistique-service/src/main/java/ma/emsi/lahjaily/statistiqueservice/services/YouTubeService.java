package ma.emsi.lahjaily.statistiqueservice.services;

import ma.emsi.lahjaily.statistiqueservice.dto.YouTubeSearchResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class YouTubeService {

    private final WebClient webClient;

    @Value("${youtube.api.key}")
    private String apiKey;

    // Injection du WebClient configuré
    public YouTubeService(WebClient youtubeWebClient) {
        this.webClient = youtubeWebClient;
    }

    public Mono<YouTubeSearchResponse> searchVideos(String query) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/search")
                        .queryParam("q", query)        // Le terme de recherche
                        .queryParam("part", "snippet") // On veut les infos de base (titre, desc)
                        .queryParam("type", "video")   // On cherche uniquement des vidéos
                        .queryParam("maxResults", 5)   // On prend les 5 premiers résultats
                        .queryParam("key", apiKey)     // Votre clé d'API
                        .build())
                .retrieve() // Exécute la requête
                .bodyToMono(YouTubeSearchResponse.class); // Mappe la réponse à votre DTO
    }
}