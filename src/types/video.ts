/**
 * Video element types
 */
export type VideoElementType = 'video' | 'image' | 'text' | 'audio' | 'sticker' | 'caption';

/**
 * Base element interface
 */
export interface EditorElement {
  id: string;
  type: VideoElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  startTime: number; // milliseconds
  duration: number; // milliseconds
}

/**
 * Video element
 */
export interface VideoElement extends EditorElement {
  type: 'video';
  src: string;
  volume: number;
  speed: number; // 0.5 = half speed, 2 = double speed
  trim: {
    start: number;
    end: number;
  };
  loop: boolean;
  filters: VideoFilter[];
}

/**
 * Image element
 */
export interface ImageElement extends EditorElement {
  type: 'image';
  src: string;
  filters: ImageFilter[];
}

/**
 * Text element
 */
export interface TextElement extends EditorElement {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  backgroundColor: string;
  padding: number;
  alignment: 'left' | 'center' | 'right';
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

/**
 * Audio element
 */
export interface AudioElement extends EditorElement {
  type: 'audio';
  src: string;
  volume: number;
  loop: boolean;
}

/**
 * Sticker element
 */
export interface StickerElement extends EditorElement {
  type: 'sticker';
  src: string;
  animation: 'none' | 'bounce' | 'pulse' | 'spin' | 'zoom';
}

/**
 * Caption element (auto-generated from audio)
 */
export interface CaptionElement extends EditorElement {
  type: 'caption';
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  backgroundColor: string;
  padding: number;
  alignment: 'left' | 'center' | 'right';
  highlight: boolean;
  startTimeOffset: number; // Offset from base video time in ms
  duration: number; // Duration of this caption in ms
}

/**
 * Filters for video elements
 */
export type VideoFilter =
  | { type: 'brightness'; value: number }
  | { type: 'contrast'; value: number }
  | { type: 'saturation'; value: number }
  | { type: 'hue'; value: number }
  | { type: 'blur'; value: number }
  | { type: 'sepia'; value: number }
  | { type: 'grayscale'; value: number }
  | { type: 'invert'; value: number };

/**
 * Filters for image elements
 */
export type ImageFilter = VideoFilter;

/**
 * Video project
 */
export interface VideoProject {
  id: string;
  name: string;
  description?: string;
  duration: number; // in milliseconds
  width: number;
  height: number;
  aspectRatio: string;
  elements: EditorElement[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Video template
 */
export interface VideoTemplate {
  id: string;
  name: string;
  description: string;
  width: number;
  height: number;
  thumbnail: string;
  elements: (VideoElement | ImageElement | TextElement | AudioElement | StickerElement)[];
  category: 'trending' | 'story' | 'promo' | 'transition' | 'custom';
  tags: string[];
}

/**
 * Export settings
 */
export interface ExportSettings {
  format: 'mp4' | 'webm' | 'gif';
  quality: 'low' | 'medium' | 'high';
  resolution: {
    width: number;
    height: number;
  };
  fps: number;
}

/**
 * Video analysis result
 */
export interface VideoAnalysisResult {
  duration: number;
  resolution: {
    width: number;
    height: number;
  };
  fps: number;
  hasAudio: boolean;
  fileSize: number; // in bytes
  format: string;
  orientation: 'landscape' | 'portrait' | 'square';
}

/**
 * Caption generation settings
 */
export interface CaptionGenerationSettings {
  language: string;
  style: 'caption' | 'karaoke' | 'subtitle';
  autoSync: boolean;
  fontSize: number;
  fontFamily: string;
  color: string;
  backgroundColor: string;
}

/**
 * Caption timestamp
 */
export interface CaptionTimestamp {
  text: string;
  startTime: number;
  endTime: number;
}

// Base editor element
export interface BaseEditorElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  startTime: number; // in milliseconds
  duration: number; // in milliseconds
}

// Video element
export interface VideoElement extends BaseEditorElement {
  type: 'video';
  src: string;
  volume: number;
  loop: boolean;
  muted: boolean;
  trimStart: number; // in milliseconds
  trimEnd: number; // in milliseconds
  playbackRate: number;
  filters?: VideoFilter[];
}

// Image element
export interface ImageElement extends BaseEditorElement {
  type: 'image';
  src: string;
  alt?: string;
  borderRadius?: number;
  filters?: ImageFilter[];
}

// Text element
export interface TextElement extends BaseEditorElement {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  backgroundColor: string;
  padding: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  alignment: 'left' | 'center' | 'right';
  animation?: TextAnimation;
}

// Sticker element
export interface StickerElement extends BaseEditorElement {
  type: 'sticker';
  src: string;
  alt?: string;
  animation?: StickerAnimation;
}

// Audio element
export interface AudioElement extends BaseEditorElement {
  type: 'audio';
  src: string;
  volume: number;
  loop: boolean;
  muted: boolean;
  trimStart: number; // in milliseconds
  trimEnd: number; // in milliseconds
  fadeIn: number; // in milliseconds
  fadeOut: number; // in milliseconds
}

// Caption element
export interface CaptionElement extends BaseEditorElement {
  type: 'caption';
  text: string;
  language: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  backgroundColor: string;
  padding: number;
  bold: boolean;
  italic: boolean;
  position: 'top' | 'bottom';
}

// Union type for all editor elements
export type EditorElement =
  | VideoElement
  | ImageElement
  | TextElement
  | StickerElement
  | AudioElement
  | CaptionElement;

// Video filter interfaces
export interface VideoFilter {
  type: string;
  value: number;
}

// Image filter interfaces
export interface ImageFilter {
  type: string;
  value: number;
}

// Animation interfaces
export interface TextAnimation {
  type: string;
  duration: number;
  delay: number;
  easing: string;
}

export interface StickerAnimation {
  type: string;
  duration: number;
  delay: number;
  easing: string;
}

// Export options
export interface ExportOptions {
  format: 'mp4' | 'webm' | 'gif';
  quality: 'low' | 'medium' | 'high';
  width?: number;
  height?: number;
  fps?: number;
  includeAudio: boolean;
}

// Video rendering status
export interface RenderingStatus {
  id: string;
  projectId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number; // 0 to 100
  url?: string;
  error?: string;
  startedAt: string;
  completedAt?: string;
}

// Draft project
export interface DraftProject {
  id: string;
  name: string;
  thumbnail?: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
}
