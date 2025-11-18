package ma.emsi.lahjaily.statistiqueservice.web;

import ma.emsi.lahjaily.statistiqueservice.dto.YouTubeSearchResponse;
import ma.emsi.lahjaily.statistiqueservice.services.YouTubeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/stats")
public class StatistiqueController {

    private final YouTubeService youTubeService;

    public StatistiqueController(YouTubeService youTubeService) {
        this.youTubeService = youTubeService;
    }

    /**
     * Recherche des vidéos YouTube liées à un sujet (ex: titre de cours).
     *
     * @param query Le terme de recherche (ex: "Spring Boot")
     * @return Un Mono contenant la réponse de l'API YouTube
     */
    @GetMapping("/youtube")
    public Mono<YouTubeSearchResponse> getYouTubeVideos(@RequestParam String query) {
        return youTubeService.searchVideos(query);
    }
}