import "./board.js";

export let objetivo;

export function randomizeObjective() {
    objetivo = Math.floor(Math.random() * 4) + 1;
    console.log(`Nova base gerada: ${objetivo}`);
    // Dispara um evento para notificar outros módulos sobre a nova base
    window.dispatchEvent(new Event('objectiveChanged'));
}

window.onload = function() {
    randomizeObjective();
};

function updateObjectiveIcon() {
    const iconElement = document.getElementById('objective-icon');
    if (!iconElement) return;

    let iconPath = '';
    switch (objetivo) {
        case 1:
            iconPath = './assets/redsquare.png';
            break;
        case 2:
            iconPath = './assets/greensquare.png';
            break;
        case 3:
            iconPath = './assets/redtriangle.png';
            break;
        case 4:
            iconPath = './assets/greentriangle.png';
            break;
        default:
            iconPath = './assets/redsquare.png'; // Fallback
    }
    iconElement.src = iconPath;
}

// Atualiza o ícone quando o objetivo muda
window.addEventListener('objectiveChanged', updateObjectiveIcon);

