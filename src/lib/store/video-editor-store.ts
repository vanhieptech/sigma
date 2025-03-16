'use client';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import {
  VideoProject,
  EditorElement,
  VideoElement,
  ImageElement,
  TextElement,
  AudioElement,
  StickerElement,
  CaptionElement,
  VideoTemplate,
  ExportSettings,
  CaptionGenerationSettings,
} from '@/types/video';

interface VideoEditorState {
  // Project state
  currentProject: VideoProject | null;
  projects: VideoProject[];

  // Editor state
  selectedElementIds: string[];
  isPlaying: boolean;
  currentTime: number;

  // Project actions
  createProject: (project: Partial<VideoProject>) => void;
  updateProject: (projectId: string, updates: Partial<VideoProject>) => void;
  deleteProject: (projectId: string) => void;
  loadProject: (projectId: string) => void;

  // Element actions
  addElement: (element: Omit<EditorElement, 'id'>) => void;
  updateElement: (elementId: string, updates: Partial<EditorElement>) => void;
  removeElement: (elementId: string) => void;
  duplicateElement: (elementId: string) => void;

  // Selection actions
  selectElement: (elementId: string) => void;
  deselectElement: (elementId: string) => void;
  deselectAllElements: () => void;

  // Playback actions
  play: () => void;
  pause: () => void;
  seekTo: (time: number) => void;

  // History for undo/redo
  history: VideoProject[];
  historyIndex: number;

  // Templates
  templates: VideoTemplate[];

  // Export settings
  exportSettings: ExportSettings;

  // Caption settings
  captionSettings: CaptionGenerationSettings;

  // Timeline
  timelinePosition: number; // Current timeline position in milliseconds

  // Project actions
  saveProject: () => void;

  // Template actions
  applyTemplate: (templateId: string) => void;
  createTemplate: (
    name: string,
    description: string,
    category: VideoTemplate['category'],
    tags: string[]
  ) => void;

  // Timeline actions
  setTimelinePosition: (position: number) => void;

  // Caption actions
  generateCaptions: () => void;
}

// Default values
const DEFAULT_PROJECT: VideoProject = {
  id: '',
  name: 'Untitled Project',
  width: 1080,
  height: 1920, // 9:16 ratio for TikTok
  backgroundColor: '#000000',
  elements: [],
  duration: 15000, // 15 seconds
  createdAt: '',
  updatedAt: '',
};

const DEFAULT_EXPORT_SETTINGS: ExportSettings = {
  format: 'mp4',
  quality: 'high',
  resolution: {
    width: 1080,
    height: 1920,
  },
  fps: 30,
};

const DEFAULT_CAPTION_SETTINGS: CaptionGenerationSettings = {
  language: 'en',
  style: 'caption',
  autoSync: true,
  fontSize: 24,
  fontFamily: 'Arial',
  color: '#FFFFFF',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
};

// Create the store
export const useVideoEditorStore = create<VideoEditorState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        currentProject: null,
        projects: [],
        selectedElementIds: [],
        isPlaying: false,
        currentTime: 0,
        history: [],
        historyIndex: -1,
        templates: [],
        exportSettings: DEFAULT_EXPORT_SETTINGS,
        captionSettings: DEFAULT_CAPTION_SETTINGS,
        timelinePosition: 0,

        // Project actions
        createProject: project => {
          const newProject: VideoProject = {
            id: uuidv4(),
            name: project.name || 'Untitled Project',
            description: project.description || '',
            duration: project.duration || 60000, // Default: 60 seconds
            width: project.width || 1080,
            height: project.height || 1920,
            aspectRatio: project.aspectRatio || '9:16',
            elements: project.elements || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set(state => ({
            projects: [...state.projects, newProject],
            currentProject: newProject,
            selectedElementIds: [],
            timelinePosition: 0,
            isPlaying: false,
            history: [newProject],
            historyIndex: 0,
          }));
        },

        updateProject: (projectId, updates) => {
          set(state => ({
            projects: state.projects.map(project =>
              project.id === projectId
                ? {
                    ...project,
                    ...updates,
                    updatedAt: new Date().toISOString(),
                  }
                : project
            ),
            currentProject:
              state.currentProject?.id === projectId
                ? { ...state.currentProject, ...updates, updatedAt: new Date().toISOString() }
                : state.currentProject,
          }));
        },

        deleteProject: projectId => {
          set(state => ({
            projects: state.projects.filter(project => project.id !== projectId),
            currentProject: state.currentProject?.id === projectId ? null : state.currentProject,
          }));
        },

        loadProject: projectId => {
          const { projects } = get();
          const project = projects.find(p => p.id === projectId);

          if (project) {
            set({
              currentProject: project,
              selectedElementIds: [],
              isPlaying: false,
              currentTime: 0,
            });
          }
        },

        // Element actions
        addElement: element => {
          const { currentProject } = get();

          if (!currentProject) return;

          const newElement = {
            ...element,
            id: uuidv4(),
          } as EditorElement;

          set(state => ({
            currentProject: state.currentProject
              ? {
                  ...state.currentProject,
                  elements: [...state.currentProject.elements, newElement],
                  updatedAt: new Date().toISOString(),
                }
              : null,
          }));
        },

        updateElement: (elementId, updates) => {
          const { currentProject } = get();

          if (!currentProject) return;

          set(state => ({
            currentProject: state.currentProject
              ? {
                  ...state.currentProject,
                  elements: state.currentProject.elements.map(element =>
                    element.id === elementId ? { ...element, ...updates } : element
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : null,
          }));
        },

        removeElement: elementId => {
          const { currentProject, selectedElementIds } = get();

          if (!currentProject) return;

          set(state => ({
            currentProject: state.currentProject
              ? {
                  ...state.currentProject,
                  elements: state.currentProject.elements.filter(
                    element => element.id !== elementId
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : null,
            selectedElementIds: selectedElementIds.filter(id => id !== elementId),
          }));
        },

        duplicateElement: elementId => {
          const { currentProject } = get();

          if (!currentProject) return;

          const elementToDuplicate = currentProject.elements.find(
            element => element.id === elementId
          );

          if (!elementToDuplicate) return;

          const duplicatedElement = {
            ...elementToDuplicate,
            id: uuidv4(),
            x: elementToDuplicate.x + 20, // Offset slightly
            y: elementToDuplicate.y + 20,
          };

          set(state => ({
            currentProject: state.currentProject
              ? {
                  ...state.currentProject,
                  elements: [...state.currentProject.elements, duplicatedElement],
                  updatedAt: new Date().toISOString(),
                }
              : null,
            selectedElementIds: [duplicatedElement.id],
          }));
        },

        // Selection actions
        selectElement: elementId => {
          set(state => {
            // Check if element is already selected
            if (state.selectedElementIds.includes(elementId)) {
              return state;
            }

            // Add to selection (multi-select if holding Shift, otherwise replace)
            const isMultiSelect = false; // TODO: Implement Shift key detection

            return {
              selectedElementIds: isMultiSelect
                ? [...state.selectedElementIds, elementId]
                : [elementId],
            };
          });
        },

        deselectElement: elementId => {
          set(state => ({
            selectedElementIds: state.selectedElementIds.filter(id => id !== elementId),
          }));
        },

        deselectAllElements: () => {
          set({
            selectedElementIds: [],
          });
        },

        // Playback actions
        play: () => {
          set({
            isPlaying: true,
          });
        },

        pause: () => {
          set({
            isPlaying: false,
          });
        },

        seekTo: time => {
          set({
            currentTime: time,
          });
        },

        // History actions
        undo: () => {
          const { history, historyIndex } = get();

          if (historyIndex <= 0) return;

          const newIndex = historyIndex - 1;
          const previousProject = history[newIndex];

          set({
            currentProject: previousProject,
            historyIndex: newIndex,
            selectedElementIds: [],
          });
        },

        redo: () => {
          const { history, historyIndex } = get();

          if (historyIndex === -1 || historyIndex >= history.length - 1) return;

          const newIndex = historyIndex + 1;
          const nextProject = history[newIndex];

          set({
            currentProject: nextProject,
            historyIndex: newIndex,
            selectedElementIds: [],
          });
        },

        // Template actions
        applyTemplate: templateId => {
          const { templates, currentProject } = get();

          if (!currentProject) return;

          const template = templates.find(t => t.id === templateId);

          if (!template) return;

          // Create new ids for all template elements to avoid conflicts
          const elementsWithNewIds = template.elements.map(element => ({
            ...element,
            id: uuidv4(),
          }));

          const updatedProject = {
            ...currentProject,
            elements: elementsWithNewIds,
            width: template.width,
            height: template.height,
            updatedAt: new Date().toISOString(),
          };

          set({
            currentProject: updatedProject,
            selectedElementIds: [],
            history: [...get().history, updatedProject],
            historyIndex: get().history.length,
          });
        },

        createTemplate: (name, description, category, tags) => {
          const { currentProject, templates } = get();

          if (!currentProject) return;

          const newTemplate: VideoTemplate = {
            id: uuidv4(),
            name,
            description,
            width: currentProject.width,
            height: currentProject.height,
            thumbnail: '', // This would be generated in a real implementation
            elements: currentProject.elements,
            category,
            tags,
          };

          set({
            templates: [...templates, newTemplate],
          });
        },

        // Timeline actions
        setTimelinePosition: position => {
          const { currentProject } = get();

          if (!currentProject) return;

          // Ensure position is within project bounds
          const clampedPosition = Math.max(0, Math.min(position, currentProject.duration));

          set({ timelinePosition: clampedPosition });
        },

        // Caption actions
        generateCaptions: () => {
          const { currentProject, captionSettings } = get();

          if (!currentProject) return;

          // In a real implementation, this would use a speech-to-text service
          console.log('Generating captions with settings:', captionSettings);

          // Mock caption generation (would be done by a real service)
          const videoElement = currentProject.elements.find(
            (el): el is VideoElement => el.type === 'video'
          );

          if (!videoElement) return;

          // Mock captions
          const mockCaptions: CaptionElement[] = [
            {
              id: uuidv4(),
              type: 'caption',
              text: 'This is a mock caption',
              x: currentProject.width * 0.1,
              y: currentProject.height * 0.8,
              width: currentProject.width * 0.8,
              height: 50,
              rotation: 0,
              opacity: 1,
              zIndex: 10,
              startTime: 1000,
              duration: 2000,
              fontSize: captionSettings.fontSize,
              fontFamily: captionSettings.fontFamily,
              color: captionSettings.color,
              backgroundColor: captionSettings.backgroundColor,
              padding: 8,
              alignment: 'center',
              highlight: true,
              startTimeOffset: 1000,
            },
            {
              id: uuidv4(),
              type: 'caption',
              text: 'Generated automatically from audio',
              x: currentProject.width * 0.1,
              y: currentProject.height * 0.8,
              width: currentProject.width * 0.8,
              height: 50,
              rotation: 0,
              opacity: 1,
              zIndex: 10,
              startTime: 3000,
              duration: 2500,
              fontSize: captionSettings.fontSize,
              fontFamily: captionSettings.fontFamily,
              color: captionSettings.color,
              backgroundColor: captionSettings.backgroundColor,
              padding: 8,
              alignment: 'center',
              highlight: true,
              startTimeOffset: 3000,
            },
          ];

          // Add captions to project
          const updatedElements = [
            ...currentProject.elements.filter(el => el.type !== 'caption'),
            ...mockCaptions,
          ];

          const updatedProject = {
            ...currentProject,
            elements: updatedElements,
            updatedAt: new Date().toISOString(),
          };

          set({
            currentProject: updatedProject,
            history: [...get().history, updatedProject],
            historyIndex: get().history.length,
          });
        },
      }),
      {
        name: 'video-editor-storage',
      }
    )
  )
);
