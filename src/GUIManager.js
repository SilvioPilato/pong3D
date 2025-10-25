import { GUI } from "dat.gui";
import { AudioHandler } from "./AudioHandler.js";
import {
    MENU_AUDIO_FOLDER,
    MENU_AUDIO_MUTED,
    MENU_AUDIO_VOLUME,
    AUDIO_MUTED,
    AUDIO_VOLUME
} from "./config/index.js";

export class GUIManager {
    constructor() {
        this.gui = null;
        this.audioFolder = null;
        this.audioSettings = {
            [MENU_AUDIO_MUTED]: AUDIO_MUTED,
            [MENU_AUDIO_VOLUME]: AUDIO_VOLUME,
        };
    }

    /**
     * Initialize the main GUI instance
     */
    initializeGUI() {
        this.gui = new GUI();
        return this.gui;
    }

    /**
     * Setup audio controls in the GUI
     */
    setupAudioControls() {
        if (!this.gui) {
            this.initializeGUI();
        }

        this.audioFolder = this.gui.addFolder(MENU_AUDIO_FOLDER);
        
        // Mute toggle
        this.audioFolder.add(this.audioSettings, MENU_AUDIO_MUTED).onChange(value => {
            AudioHandler.setMuted(value);
        });
        
        // Volume slider
        this.audioFolder.add(this.audioSettings, MENU_AUDIO_VOLUME, 0, 1, 0.05).onChange(value => {
            AudioHandler.setVolume(value);
        });

        return this.audioFolder;
    }

    /**
     * Add a custom folder to the GUI
     */
    addFolder(name) {
        if (!this.gui) {
            this.initializeGUI();
        }
        return this.gui.addFolder(name);
    }

    /**
     * Add a control to the GUI or a specific folder
     */
    addControl(object, property, min = undefined, max = undefined, step = undefined, folder = null) {
        const target = folder || this.gui;
        if (!target) {
            this.initializeGUI();
        }
        
        if (min !== undefined && max !== undefined) {
            return target.add(object, property, min, max, step);
        } else {
            return target.add(object, property);
        }
    }

    /**
     * Get the current audio settings
     */
    getAudioSettings() {
        return { ...this.audioSettings };
    }

    /**
     * Update audio settings programmatically
     */
    updateAudioSettings(settings) {
        Object.assign(this.audioSettings, settings);
        
        // Update GUI controllers if they exist
        if (this.audioFolder) {
            this.audioFolder.updateDisplay();
        }
    }

    /**
     * Show/hide the GUI
     */
    setVisible(visible) {
        if (this.gui) {
            this.gui.domElement.style.display = visible ? 'block' : 'none';
        }
    }

    /**
     * Destroy the GUI and clean up
     */
    destroy() {
        if (this.gui) {
            this.gui.destroy();
            this.gui = null;
            this.audioFolder = null;
        }
    }

    /**
     * Get the main GUI instance
     */
    getGUI() {
        return this.gui;
    }

    /**
     * Get the audio folder instance
     */
    getAudioFolder() {
        return this.audioFolder;
    }
}