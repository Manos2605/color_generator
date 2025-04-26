document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const colorPalette = document.getElementById('color-palette');
    const generateBtn = document.getElementById('generate-btn');
    const saveBtn = document.getElementById('save-btn');
    const clearBtn = document.getElementById('clear-btn');
    const colorCountSelect = document.getElementById('color-count');
    const hueRangeSelect = document.getElementById('hue-range');
    const colorDisplay = document.getElementById('color-display');
    const hexValue = document.getElementById('hex-value');
    const rgbValue = document.getElementById('rgb-value');
    const hslValue = document.getElementById('hsl-value');
    const savedContainer = document.getElementById('saved-container');

    // Variables d'état
    let currentColors = [];
    let savedPalettes = JSON.parse(localStorage.getItem('colorPalettes')) || [];

    // Initialisation
    renderSavedPalettes();
    generatePalette();

    // Événements
    generateBtn.addEventListener('click', generatePalette);
    saveBtn.addEventListener('click', savePalette);
    clearBtn.addEventListener('click', clearSavedPalettes);
    colorPalette.addEventListener('click', handleColorClick);

    // Fonctions
    function generatePalette() {
        const colorCount = parseInt(colorCountSelect.value);
        const hueRange = hueRangeSelect.value;
        currentColors = [];
        colorPalette.innerHTML = '';

        let hueStart, hueEnd;
        
        // Définir la plage de teintes selon la sélection
        switch(hueRange) {
            case 'warm':
                hueStart = 0;
                hueEnd = 90;
                break;
            case 'cool':
                hueStart = 180;
                hueEnd = 270;
                break;
            case 'pastel':
                // Pour les pastels, nous utiliserons une saturation et luminosité spécifiques
                break;
            default:
                hueStart = 0;
                hueEnd = 360;
        }

        for (let i = 0; i < colorCount; i++) {
            let hue, saturation, lightness;
            
            if (hueRange === 'pastel') {
                // Génération de couleurs pastel
                hue = Math.floor(Math.random() * 360);
                saturation = Math.floor(Math.random() * 30) + 70; // 70-100%
                lightness = Math.floor(Math.random() * 20) + 80; // 80-100%
            } else {
                // Génération normale
                hue = Math.floor(Math.random() * (hueEnd - hueStart + 1)) + hueStart;
                saturation = Math.floor(Math.random() * 30) + 70; // 70-100%
                lightness = Math.floor(Math.random() * 30) + 50; // 50-80%
            }

            const color = chroma.hsl(hue, saturation/100, lightness/100);
            const hex = color.hex();
            currentColors.push(hex);

            const colorElement = document.createElement('div');
            colorElement.className = 'color';
            colorElement.style.backgroundColor = hex;
            colorElement.setAttribute('data-hex', hex);
            colorPalette.appendChild(colorElement);
        }

        // Afficher la première couleur par défaut
        if (currentColors.length > 0) {
            displayColorInfo(currentColors[0]);
        }
    }

    function displayColorInfo(hexColor) {
        const color = chroma(hexColor);
        colorDisplay.style.backgroundColor = hexColor;
        hexValue.textContent = hexColor;
        rgbValue.textContent = color.rgb().join(', ');
        hslValue.textContent = `${Math.round(color.hsl()[0])}, ${Math.round(color.hsl()[1]*100)}%, ${Math.round(color.hsl()[2]*100)}%`;
    }

    function handleColorClick(e) {
        if (e.target.classList.contains('color')) {
            const hexColor = e.target.getAttribute('data-hex');
            displayColorInfo(hexColor);
        }
    }

    function savePalette() {
        if (currentColors.length === 0) return;

        // Vérifier si cette palette existe déjà
        const paletteStr = JSON.stringify(currentColors);
        const exists = savedPalettes.some(p => JSON.stringify(p) === paletteStr);
        
        if (exists) {
            alert('Cette palette est déjà sauvegardée!');
            return;
        }

        savedPalettes.push([...currentColors]);
        localStorage.setItem('colorPalettes', JSON.stringify(savedPalettes));
        renderSavedPalettes();
    }

    function renderSavedPalettes() {
        savedContainer.innerHTML = '';

        if (savedPalettes.length === 0) {
            savedContainer.innerHTML = '<p>Aucune palette sauvegardée pour le moment.</p>';
            return;
        }

        savedPalettes.forEach((palette, index) => {
            const paletteElement = document.createElement('div');
            paletteElement.className = 'saved-palette';

            palette.forEach(color => {
                const colorElement = document.createElement('div');
                colorElement.className = 'saved-color';
                colorElement.style.backgroundColor = color;
                paletteElement.appendChild(colorElement);
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-palette';
            deleteBtn.innerHTML = '×';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deletePalette(index);
            });

            paletteElement.appendChild(deleteBtn);
            paletteElement.addEventListener('click', () => {
                loadPalette(index);
            });

            savedContainer.appendChild(paletteElement);
        });
    }

    function deletePalette(index) {
        if (confirm('Supprimer cette palette?')) {
            savedPalettes.splice(index, 1);
            localStorage.setItem('colorPalettes', JSON.stringify(savedPalettes));
            renderSavedPalettes();
        }
    }

    function loadPalette(index) {
        currentColors = [...savedPalettes[index]];
        colorPalette.innerHTML = '';

        currentColors.forEach(hex => {
            const colorElement = document.createElement('div');
            colorElement.className = 'color';
            colorElement.style.backgroundColor = hex;
            colorElement.setAttribute('data-hex', hex);
            colorPalette.appendChild(colorElement);
        });

        if (currentColors.length > 0) {
            displayColorInfo(currentColors[0]);
        }
    }

    function clearSavedPalettes() {
        if (savedPalettes.length === 0) return;
        
        if (confirm('Voulez-vous vraiment supprimer toutes les palettes sauvegardées?')) {
            savedPalettes = [];
            localStorage.removeItem('colorPalettes');
            renderSavedPalettes();
        }
    }
});