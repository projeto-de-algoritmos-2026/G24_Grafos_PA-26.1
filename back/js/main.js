import "./board.js";

export let objetivo;
const MAX_OBJECTIVES = 8;

export function setObjective(newObjective) {
    objetivo = newObjective;
    console.log(`Base selecionada pelo jogador: ${objetivo}`);
    window.dispatchEvent(new Event('objectiveChanged'));
}

window.onload = function() {
    setObjective(0); 

    const prevBtn = document.getElementById('prev-objective-btn');
    const nextBtn = document.getElementById('next-objective-btn');

    nextBtn.addEventListener('click', () => {
        let next = objetivo + 1;
        if (next > MAX_OBJECTIVES) {
            next = 1; 
        }
        setObjective(next);
    });

    prevBtn.addEventListener('click', () => {
        let prev = objetivo - 1;
        if (prev < 1) {
            prev = MAX_OBJECTIVES; 
        }
        setObjective(prev);
    });
};

function updateObjectiveIcon() {
    const iconElement = document.getElementById('objective-icon');
    if (!iconElement) return;

    let iconPath = '';
    switch (objetivo) {
        case 0:
            iconPath = './assets/redsquare.png';
            break;
        case 1:
            iconPath = './assets/redsquare.png';
            break;
        case 2:
            iconPath = './assets/greensquare.png';
            break;
        case 3:
            iconPath = './assets/yellowsquare.png';
            break;
        case 4:
            iconPath = './assets/bluesquare.png';
            break;
        case 5:
            iconPath = './assets/redtriangle.png';
            break;
        case 6:
            iconPath = './assets/greentriangle.png';
            break;
        case 7:
            iconPath = './assets/bluetriangle.png';
            break;
        case 8:
            iconPath = './assets/yellowtriangle.png';
            break;
        default:
            iconPath = './assets/questionmark.png'; // Fallback
    }
    iconElement.src = iconPath;
}

// Atualiza o ícone quando o objetivo muda
window.addEventListener('objectiveChanged', updateObjectiveIcon);