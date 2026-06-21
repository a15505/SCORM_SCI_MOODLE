/**
 * API Wrapper SCORM 1.2
 * Gère la communication avec le LMS (Moodle) et fournit une simulation hors-ligne.
 */

const ScormAPI = {
    api: null,
    isAvailable: false,

    // Journalise les actions SCORM pour le débogage
    log(message, type = 'info') {
        console.log(`[SCORM] ${message}`);
    },

    // Recherche de l'API SCORM fournie par Moodle (dans les fenêtres parentes)
    findAPI(win) {
        let findAttempts = 0;
        const findAttemptLimit = 500;
        
        // Helper function to safely check if a window has a valid API object
        const checkAPI = (w) => {
            try {
                return w && w.API != null ? w.API : null;
            } catch (e) {
                return null;
            }
        };

        let currentWin = win;
        while (currentWin) {
            findAttempts++;
            if (findAttempts > findAttemptLimit) {
                this.log("Limite de recherche d'API SCORM atteinte.", "error");
                break;
            }

            // Check current window
            const api = checkAPI(currentWin);
            if (api) return api;

            // Try to climb to parent window
            let nextWin = null;
            try {
                if (currentWin.parent && currentWin.parent !== currentWin) {
                    nextWin = currentWin.parent;
                }
            } catch (e) {
                // Cross-Origin access error on parent
                this.log("Accès Cross-Origin bloqué vers le parent d'une fenêtre.", "warning");
            }

            // If we cannot climb further up in the parent tree, check opener
            if (!nextWin) {
                try {
                    if (currentWin.opener) {
                        nextWin = currentWin.opener;
                    }
                } catch (e) {
                    // Cross-Origin access error on opener
                    this.log("Accès Cross-Origin bloqué vers l'opener d'une fenêtre.", "warning");
                }
            }

            currentWin = nextWin;
        }
        return null;
    },

    // Initialisation de la connexion
    init() {
        try {
            this.api = this.findAPI(window);
            
            if (this.api) {
                const result = this.api.LMSInitialize("");
                if (result === "true") {
                    this.isAvailable = true;
                    this.log("LMSInitialize exécuté avec succès.", "success");
                    return true;
                } else {
                    this.log("Échec de LMSInitialize (retourne false).", "error");
                    this.isAvailable = false;
                    return false;
                }
            } else {
                this.log("API SCORM non trouvée. Mode simulation hors-ligne activé.", "warning");
                this.isAvailable = false;
                // Alerter le simulateur Moodle parent via postMessage
                try {
                    if (window.parent && window.parent !== window) {
                        window.parent.postMessage({ type: 'scorm_initialize' }, '*');
                    }
                } catch (err) {}
                return false;
            }
        } catch (e) {
            this.log("Exception lors de LMSInitialize: " + e.message + ". Mode simulation activé.", "error");
            this.isAvailable = false;
            // Alerter le simulateur Moodle parent via postMessage
            try {
                if (window.parent && window.parent !== window) {
                    window.parent.postMessage({ type: 'scorm_initialize' }, '*');
                }
            } catch (err) {}
            return false;
        }
    },

    // Lecture d'une variable
    getValue(parameter) {
        if (this.isAvailable && this.api) {
            try {
                const val = this.api.LMSGetValue(parameter);
                this.log(`LMSGetValue("${parameter}") -> "${val}"`, "info");
                return val;
            } catch (e) {
                this.log(`Exception dans LMSGetValue("${parameter}"): ${e.message}`, "error");
                return "";
            }
        } else {
            // Lecture simulée en local
            const localVal = localStorage.getItem(`scorm_mock_${parameter}`) || "";
            this.log(`[Simulation] LMSGetValue("${parameter}") -> "${localVal}"`, "info");
            return localVal;
        }
    },

    // Écriture d'une variable
    setValue(parameter, value) {
        if (this.isAvailable && this.api) {
            try {
                const result = this.api.LMSSetValue(parameter, value);
                this.log(`LMSSetValue("${parameter}", "${value}") -> ${result}`, "info");
                return result === "true";
            } catch (e) {
                this.log(`Exception dans LMSSetValue("${parameter}", "${value}"): ${e.message}`, "error");
                return false;
            }
        } else {
            // Écriture simulée en local
            localStorage.setItem(`scorm_mock_${parameter}`, value);
            this.log(`[Simulation] LMSSetValue("${parameter}", "${value}") -> true`, "info");
            // Notifier le simulateur Moodle parent via postMessage
            try {
                if (window.parent && window.parent !== window) {
                    window.parent.postMessage({
                        type: 'scorm_setvalue',
                        parameter: parameter,
                        value: value
                    }, '*');
                }
            } catch (err) {}
            return true;
        }
    },

    // Sauvegarde des données
    commit() {
        if (this.isAvailable && this.api) {
            try {
                const result = this.api.LMSCommit("");
                this.log(`LMSCommit() -> ${result}`, "success");
                return result === "true";
            } catch (e) {
                this.log(`Exception dans LMSCommit(): ${e.message}`, "error");
                return false;
            }
        } else {
            this.log(`[Simulation] LMSCommit() -> true`, "success");
            // Notifier le simulateur Moodle parent via postMessage
            try {
                if (window.parent && window.parent !== window) {
                    window.parent.postMessage({ type: 'scorm_commit' }, '*');
                }
            } catch (err) {}
            return true;
        }
    },

    // Fermeture de la connexion
    finish() {
        if (this.isAvailable && this.api) {
            try {
                const result = this.api.LMSFinish("");
                this.log(`LMSFinish() -> ${result}`, "success");
                this.isAvailable = false;
                return result === "true";
            } catch (e) {
                this.log(`Exception dans LMSFinish(): ${e.message}`, "error");
                this.isAvailable = false;
                return false;
            }
        } else {
            this.log(`[Simulation] LMSFinish() -> true`, "success");
            // Notifier le simulateur Moodle parent via postMessage
            try {
                if (window.parent && window.parent !== window) {
                    window.parent.postMessage({ type: 'scorm_finish' }, '*');
                }
            } catch (err) {}
            return true;
        }
    },

    lastSetHeight: 0,

    // Ajuste la hauteur de l'iframe parent dans Moodle pour éviter les barres de défilement (inspiré de scormGenerator.ts)
    adjustParentIframeHeight(padding = 32) {
        // Mesurer la hauteur physique exacte du body pour permettre de grandir ET de rétrécir
        const height = Math.ceil(document.body.getBoundingClientRect().height) + padding;
        
        // 1. Envoyer postMessage (setHeight/resize) pour Moodle 4+ et les LMS réactifs
        try {
            if (window.parent && window.parent !== window) {
                window.parent.postMessage({ type: 'setHeight', height: height }, '*');
                window.parent.postMessage({ type: 'resize', height: height }, '*');
                window.parent.postMessage({ type: 'scorm_resize', height: height }, '*'); // Pour notre simulateur local
            }
        } catch (e) {
            console.warn("[SCORM] Échec de l'envoi de postMessage :", e);
        }

        let resizeSuccessful = false;

        // 2. Modifier l'iframe direct si accessible via window.frameElement
        try {
            if (window.frameElement) {
                window.frameElement.style.setProperty('height', height + 'px', 'important');
                window.frameElement.style.setProperty('min-height', height + 'px', 'important');
                window.frameElement.setAttribute('scrolling', 'no');
                window.frameElement.style.setProperty('overflow', 'hidden', 'important');
                resizeSuccessful = true;
                console.log(`[SCORM] Iframe direct (window.frameElement) ajusté à ${height}px.`);
            }
        } catch (e) {}

        // 3. Ajuster les conteneurs du lecteur SCORM de Moodle parent si accessible
        try {
            if (window.parent && window.parent.document) {
                const pd = window.parent.document;
                // Conteneurs de mise en page Moodle classiques
                ['scorm_content', 'scorm_layout', 'scorm_toc', 'scormpage'].forEach(function(id) {
                    const el = pd.getElementById(id);
                    if (el) { 
                        el.style.setProperty('height', 'auto', 'important'); 
                        el.style.setProperty('overflow', 'visible', 'important'); 
                    }
                });
                // Conteneur d'affichage de l'objet SCORM
                const so = pd.getElementById('scorm_object');
                if (so) {
                    so.style.setProperty('height', height + 'px', 'important');
                    so.style.setProperty('min-height', height + 'px', 'important');
                    so.style.setProperty('overflow', 'hidden', 'important');
                    resizeSuccessful = true;
                    console.log(`[SCORM] Conteneur Moodle #scorm_object ajusté à ${height}px.`);
                }
            }
        } catch (e) {}

        // 4. Solution de secours : Remonter l'arborescence des fenêtres parentes de même origine
        if (!resizeSuccessful) {
            let currentWin = window;
            let depth = 0;
            while (currentWin !== window.top && depth < 10) {
                try {
                    const parentWin = currentWin.parent;
                    if (!parentWin) break;

                    const iframes = parentWin.document.getElementsByTagName('iframe');
                    for (let i = 0; i < iframes.length; i++) {
                        if (iframes[i].contentWindow === currentWin) {
                            const currentHeight = iframes[i].style.height;
                            if (currentHeight !== (height + 'px')) {
                                if (currentWin === window) {
                                    if (Math.abs(height - this.lastSetHeight) > 5) {
                                        this.lastSetHeight = height;
                                        iframes[i].style.setProperty('height', height + 'px', 'important');
                                        iframes[i].style.setProperty('min-height', height + 'px', 'important');
                                        try {
                                            iframes[i].setAttribute('scrolling', 'no');
                                            iframes[i].style.setProperty('overflow', 'hidden', 'important');
                                        } catch (e) {}
                                        console.log(`[SCORM] Iframe parent direct (remontée niveau ${depth}) ajusté à ${height}px.`);
                                        resizeSuccessful = true;
                                    }
                                } else {
                                    iframes[i].style.setProperty('height', height + 'px', 'important');
                                    iframes[i].style.setProperty('min-height', height + 'px', 'important');
                                    try {
                                        iframes[i].setAttribute('scrolling', 'no');
                                        iframes[i].style.setProperty('overflow', 'hidden', 'important');
                                    } catch (e) {}
                                    console.log(`[SCORM] Iframe ancêtre (remontée niveau ${depth}) ajusté à ${height}px.`);
                                }
                            } else {
                                if (currentWin === window) {
                                    resizeSuccessful = true;
                                }
                            }
                            break;
                        }
                    }
                    currentWin = parentWin;
                    depth++;
                } catch (e) {
                    console.log(`[SCORM] Arrêt de la remontée récursive d'iframes au niveau ${depth} (CORS).`);
                    break;
                }
            }
        }

        // 5. Masquer le scrollbar vertical du document si le redimensionnement a réussi
        if (resizeSuccessful) {
            try {
                document.documentElement.style.overflowY = 'hidden';
                document.body.style.overflowY = 'hidden';
            } catch (e) {}
        } else {
            try {
                document.documentElement.style.overflowY = 'auto';
                document.body.style.overflowY = 'auto';
            } catch (e) {}
        }
    }
};
