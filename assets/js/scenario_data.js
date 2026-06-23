const scenarioData = {
    startNodeId: "niveau1",
    
    // Pour l'arborescence vis-network (Simulateur)
    nodes: [
        { id: "niveau1", label: "La porte\nde la grotte", storyKey: "niveau1" },
        { id: "niveau2", label: "Le pont\nsuspendu", storyKey: "niveau2" },
        { id: "niveau3", label: "Le gardien\ndu trésor", storyKey: "niveau3" },
        { id: "niveau4", label: "L'évasion\nfinale", storyKey: "niveau4" },
        { id: "victoire", label: "Victoire", storyKey: "victoire", color: "#2ecc71" }
    ],
    
    // Les liens entre les noeuds pour l'arborescence
    edges: [
        { from: "niveau1", to: "niveau2" },
        { from: "niveau1", to: "niveau1" }, // Retry
        { from: "niveau2", to: "niveau3" },
        { from: "niveau2", to: "niveau2" }, // Retry
        { from: "niveau3", to: "niveau4" },
        { from: "niveau3", to: "niveau3" }, // Retry
        { from: "niveau4", to: "victoire" },
        { from: "niveau4", to: "niveau4" }  // Retry
    ],

    // Les données réelles du jeu
    story: {
        "niveau1": {
            id: "niveau1",
            title: "La porte de la grotte",
            text: "Vous arrivez devant une immense porte en pierre. Pour l'ouvrir, vous devez placer le bon nombre de pierres précieuses dans la serrure. La porte indique : 245 + 138.<br><br>Combien de pierres devez-vous placer ?",
            image: "fas fa-dungeon",
            choices: [
                { text: "383", nextNodeId: "niveau2", scoreImpact: 25, score: 25, feedback: "Parfait ! Vous avez bien calculé la retenue (5+8=13, je retiens 1). La porte s'ouvre." },
                { text: "373", nextNodeId: "niveau1", scoreImpact: 0, score: 0, feedback: "La porte reste fermée. Attention, vous avez oublié la retenue des unités (5+8=13, il faut retenir 1 dizaine). Essayez encore !" },
                { text: "107", nextNodeId: "niveau1", scoreImpact: 0, score: 0, feedback: "Attention au signe ! C'est une addition (+), pas une soustraction (-). Recommencez." }
            ]
        },
        "niveau2": {
            id: "niveau2",
            title: "Le pont suspendu",
            text: "La porte est ouverte, mais vous facez un pont dont plusieurs planches sont cassées. Le pont peut supporter un maximum de 500 kilos. Vous pesez 40 kg, et vous avez un sac de 125 kg de matériel. <br><br>Quel est le poids total actuel sur le pont ? (125 + 40)",
            image: "fas fa-bridge-water",
            choices: [
                { text: "165 kg", nextNodeId: "niveau3", scoreImpact: 25, score: 25, feedback: "Bravo ! Vous traversez prudemment." },
                { text: "525 kg", nextNodeId: "niveau2", scoreImpact: 0, score: 0, feedback: "Oh là ! Vous avez additionné les centaines avec les dizaines ! (125 + 40 = 165, pas 525). Corrigez votre calcul pour traverser." }
            ]
        },
        "niveau3": {
            id: "niveau3",
            title: "Le gardien du trésor",
            text: "Vous arrivez dans la salle du trésor, mais un perroquet géant le garde. Il vous donne 450 pièces d'or, mais vous devez payer une taxe de pirate de 127 pièces. <br><br>Combien de pièces vous reste-t-il ? (450 - 127)",
            image: "fas fa-kiwi-bird",
            choices: [
                { text: "323", nextNodeId: "niveau4", scoreImpact: 25, score: 25, feedback: "Exact ! Vous avez bien emprunté une dizaine pour faire 10 - 7 = 3. Le trésor est à vous !" },
                { text: "333", nextNodeId: "niveau3", scoreImpact: 0, score: 0, feedback: "Le perroquet secoue la tête. Si vous faites 10 - 7 = 3, n'oubliez pas que vous avez emprunté une dizaine au 5 ! Recommencez." },
                { text: "327", nextNodeId: "niveau3", scoreImpact: 0, score: 0, feedback: "Non, vous avez juste gardé le 7 des unités. Il faut faire une soustraction complète. Essayez encore." }
            ]
        },
        "niveau4": {
            id: "niveau4",
            title: "L'évasion finale",
            text: "Le coffre s'ouvre, mais l'île commence à trembler ! Il vous faut 850 points d'énergie pour faire décoller votre bateau volant. Vous avez trouvé 580 points dans le trésor et votre navire en a déjà 270. <br><br>Avez-vous assez d'énergie ? (580 + 270)",
            image: "fas fa-ship",
            choices: [
                { text: "850, oui c'est suffisant", nextNodeId: "victoire", scoreImpact: 25, score: 25, feedback: "Félicitations ! Les calculs sont parfaits. Le bateau s'envole et vous êtes riche !" },
                { text: "750, ce n'est pas assez", nextNodeId: "niveau4", scoreImpact: 0, score: 0, feedback: "Refaites le calcul de 80 + 70. Cela fait 150, donc il faut ajouter 1 centaine. La lave monte !" }
            ]
        },
        "victoire": {
            id: "victoire",
            title: "Victoire !",
            text: "Vous vous êtes échappé de l'île avec le trésor ! Votre maîtrise des additions et soustractions vous a sauvé.",
            image: "fas fa-gem",
            choices: [],
            isEnd: true,
            status: "passed"
        }
    }
};
