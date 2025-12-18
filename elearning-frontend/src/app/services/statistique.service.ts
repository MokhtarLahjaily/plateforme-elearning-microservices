import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { YoutubeResponse } from '../models/youtube-response';

@Injectable({ providedIn: 'root' })
export class StatistiqueService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8888/statistique-service';

  searchYoutube(query: string): Observable<YoutubeResponse> {
    return this.http.get<YoutubeResponse>(`${this.baseUrl}/stats/youtube`, {
      params: { query }
    });
  }
}
