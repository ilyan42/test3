// Récupération du canvas
const canvas = document.getElementById('renderCanvas');  // Le canvas où Babylon.js va dessiner
const engine = new BABYLON.Engine(canvas, true);         // Création du moteur de rendu
const scene = new BABYLON.Scene(engine);                 // Création de la scène

// Création de la caméra
const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(7.860370854357264, 4, -55.57231601704761), scene);
camera.attachControl(canvas, true);  // Contrôles de la souris activés pour la caméra
camera.position = new BABYLON.Vector3(42, 4, -59);  // Position de la caméra
camera.rotation = new BABYLON.Vector3(0, -2.4599999999999915, 0);  // Rotation de la caméra

// Lumière pour éclairer la scène
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);


// Création du modèle 3D (stade)
BABYLON.SceneLoader.Append("/3d_object/", "test6.glb", scene, function (scene) {
    console.log("Stade chargé avec succès !");
    
    const stade = scene.meshes[scene.meshes.length - 1]; 
    stade.scaling = new BABYLON.Vector3(2, 2, 2);  // Agrandir le modèle
    stade.position = new BABYLON.Vector3(0, 0, 0); // Centrer le stade
});

BABYLON.SceneLoader.Append("/3d_object/", "persoTest.glb", scene, function (scene) {
	console.log("perso chargé avec succès !");

	scene.meshes.forEach(mesh => {
        console.log("Nom du mesh :", mesh.name);
    });

	
	const perso = scene.getMeshByName("__root__");
	perso.scaling = new BABYLON.Vector3(2.5, 2.5, 2.5);  // Agrandir le modèle
	perso.position = new BABYLON.Vector3(20, 2, -65);
	perso.rotation = new BABYLON.Vector3(0, 45, 0);

	controlPerso(perso);
});

// Fonction pour créer une plane avec texture d'herbe
function createGrassPlane(name, position) {
    const grassPlane = BABYLON.MeshBuilder.CreateGround(name, {width: 45, height: 50}, scene);
    const grassMaterial = new BABYLON.StandardMaterial(name + "Material", scene);
    grassMaterial.diffuseTexture = new BABYLON.Texture("/image/perfect-green-grass.jpg", scene);  // Remplace par le chemin de ta texture d'herbe
    grassPlane.material = grassMaterial;
    grassPlane.position = position;  // Positionner la plane
}

// Création de plusieurs planes avec de l'herbe
createGrassPlane("grassPlane1", new BABYLON.Vector3(19, 0.5, -152));
createGrassPlane("grassPlane2", new BABYLON.Vector3(19, 0.5, -102));
createGrassPlane("grassPlane3", new BABYLON.Vector3(19, 0.5, -52));
createGrassPlane("grassPlane4", new BABYLON.Vector3(-26, 0.5, -152));
createGrassPlane("grassPlane5", new BABYLON.Vector3(-26, 0.5, -102));
createGrassPlane("grassPlane6", new BABYLON.Vector3(-26, 0.5, -52));

// Variables pour les mouvements
let moveSpeed = 1; // Déplacement de la caméra
let rotateSpeed = 0.01; // Rotation

// Écouteurs d'événements pour les touches
window.addEventListener('keydown', (event) => {
    // Déplacements de la caméra (Z, Q, S, D, A, E)
    if (event.key === 'z') {
        camera.position.z -= moveSpeed; // Avancer
    }
    if (event.key === 's') {
        camera.position.z += moveSpeed; // Reculer
    }
    if (event.key === 'q') {
        camera.position.x -= moveSpeed; // Gauche
    }
    if (event.key === 'd') {
        camera.position.x += moveSpeed; // Droite
    }
    if (event.key === 'a') {
        camera.position.y -= moveSpeed; // Descendre
    }
    if (event.key === 'e') {
        camera.position.y += moveSpeed; // Monter
    }

    // Rotation de la caméra (flèches directionnelles)
    if (event.key === 'ArrowUp') {
        camera.rotation.x -= rotateSpeed; // Rotation vers le haut
    }
    if (event.key === 'ArrowDown') {
        camera.rotation.x += rotateSpeed; // Rotation vers le bas
    }
    if (event.key === 'ArrowLeft') {
        camera.rotation.y -= rotateSpeed; // Rotation vers la gauche
    }
    if (event.key === 'ArrowRight') {
        camera.rotation.y += rotateSpeed; // Rotation vers la droite
    }

    console.log(camera.position);
    console.log(camera.rotation);
});

// Boucle de rendu
engine.runRenderLoop(() => {
    scene.render();
});

// Gérer le redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    engine.resize();
});
