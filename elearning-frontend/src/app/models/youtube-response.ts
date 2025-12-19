export interface YoutubeResponse {
	items: YoutubeVideo[];
}

export interface YoutubeVideo {
	id?: VideoId;
	snippet?: VideoSnippet;
}

export interface VideoId {
	videoId: string;
}

export interface VideoSnippet {
	title: string;
	description: string;
	thumbnails?: Record<string, Thumbnail>;
}

export interface Thumbnail {
	url: string;
	width?: number;
	height?: number;
}
