package ma.emsi.lahjaily.statistiqueservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class YouTubeVideo {
    private VideoId id;
    private VideoSnippet snippet;
}