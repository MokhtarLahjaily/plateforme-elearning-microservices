import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StatistiqueService } from '../../../services/statistique.service';
import { YoutubeResponse, YoutubeVideo } from '../../../models/youtube-response';

@Component({
  selector: 'app-youtube-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './youtube-search.component.html',
  styleUrls: ['./youtube-search.component.css']
})
export class YoutubeSearchComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly statsService = inject(StatistiqueService);

  query = '';
  loading = false;
  error?: string;
  videos: YoutubeVideo[] = [];

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const q = params.get('topic') || params.get('query') || '';
      this.query = q;
      if (q) {
        this.fetchVideos(q);
      }
    });
  }

  fetchVideos(query: string): void {
    if (!query) return;

    this.loading = true;
    this.error = undefined;
    this.videos = [];

    this.statsService.searchYoutube(query).subscribe({
      next: (res: YoutubeResponse) => {
        this.videos = res?.items ?? [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Impossible de récupérer les vidéos.';
        this.loading = false;
      }
    });
  }

  videoId(item: YoutubeVideo): string | undefined {
    return item?.id?.videoId;
  }
}
