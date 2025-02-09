const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    antialias: true,
    adapToDeviceRatio: true
});

// Configuration de la scène avec une meilleure qualité
const scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);
scene.imageProcessingConfiguration.contrast = 1.2;
scene.imageProcessingConfiguration.exposure = 1.0;
scene.imageProcessingConfiguration.toneMappingEnabled = true;



// Amélioration de la qualité globale
scene.getEngine().setHardwareScalingLevel(1.0);
scene.performancePriority = BABYLON.Scene.PRIORITY_ANTIALIAS;

// Création de la caméra
const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(7.860370854357264, 4, -55.57231601704761), scene);
camera.attachControl(canvas, true);
camera.position = new BABYLON.Vector3(-45.79301951065982, 5.879735371044789, -31.342210947081313);
camera.rotation = new BABYLON.Vector3(-0.029665280069011667, -2.566387085794712, 0);
camera.minZ = 0.1;
camera.maxZ = 1000;

// Configuration de l'anti-aliasing FXAA
const pipeline = new BABYLON.DefaultRenderingPipeline(
    "defaultPipeline", 
    true, 
    scene,
    [camera]
);
pipeline.samples = 8;
pipeline.fxaaEnabled = true;
pipeline.sharpenEnabled = true;
pipeline.sharpen.edgeAmount = 0.3;


scene.getEngine().setHardwareScalingLevel(1.0);
scene.performancePriority = BABYLON.Scene.PRIORITY_ANTIALIAS;

// Ajout d'une lumière ambiante
const ambientLight = new BABYLON.HemisphericLight(
    "ambientLight",
    new BABYLON.Vector3(0, 1, 0),
    scene
);
ambientLight.intensity = 0.8;

// Chargement du stade
BABYLON.SceneLoader.Append("/3d_object/", "ImageToStl.com_football_stadiumv2.glb", scene, function () {
    console.log("Stade chargé avec succès !");

    // scene.meshes.forEach(m => {
    //     console.log("Nom du mesh :", m.name);
    // });
    
    scene.meshes.forEach(m => {
        if (m.name === "test6") { // Remplace par le nom correct du mesh principal
            m.scaling = new BABYLON.Vector3(0, 0, 0);
            m.position = new BABYLON.Vector3(0, 0, 0);
            // console.log("Scale appliqué sur :", m.name);
        }
    });
});

BABYLON.SceneLoader.ImportMesh("", "/3d_object/", "versionFinalV2.glb", scene, function (newMeshes, particleSystems, skeletons, animationGroups) {
    console.log("Modèle chargé avec succès !");

    // Trouver le mesh racine (parent)
    let rootMesh = null;
    newMeshes.forEach(mesh => {
        if (!mesh.parent) {
            rootMesh = mesh;
            // console.log("Mesh racine trouvé:", mesh.name);
        }
    });

    // Si on trouve un mesh racine, on le déplace
    if (rootMesh) {
        rootMesh.position = new BABYLON.Vector3(0, 100, 0);
    } else {
        // Si pas de mesh racine, on crée un conteneur
        let container = new BABYLON.TransformNode("container", scene);
        newMeshes.forEach(mesh => {
            mesh.setParent(container);
        });
        container.position = new BABYLON.Vector3(0, 100, 0);
    }

    // Afficher la hiérarchie pour debug
    // newMeshes.forEach(mesh => {
    //     console.log(`Mesh: ${mesh.name}, Parent: ${mesh.parent ? mesh.parent.name : 'pas de parent'}`);
    // });
});



BABYLON.SceneLoader.ImportMesh("", "/3d_object/", "ImageToStl.com_footballterraindejeuxv2.glb", scene, function (newMeshes, particleSystems, skeletons, animationGroups) {
    console.log("Modèle chargé avec succès !");

    // Trouver le mesh racine (parent)
    let rootMesh = null;
    newMeshes.forEach(mesh => {
        if (!mesh.parent) {
            rootMesh = mesh;
            // console.log("Mesh racine trouvé:", mesh.name);
        }
    });

    // Si on trouve un mesh racine, on le déplace
    if (rootMesh) {
        rootMesh.position = new BABYLON.Vector3(0, 300, 0);
    } else {
        // Si pas de mesh racine, on crée un conteneur
        let test = new BABYLON.TransformNode("test", scene);
        newMeshes.forEach(mesh => {
            mesh.setParent(test);
        });
        test.position = new BABYLON.Vector3(0, 300, 0);
    }

    // Afficher la hiérarchie pour debug
    // newMeshes.forEach(mesh => {
    //     console.log(`Mesh: ${mesh.name}, Parent: ${mesh.parent ? mesh.parent.name : 'pas de parent'}`);
    // });
});





const environment = scene.createDefaultEnvironment({
    createSkybox: false,
    // skyboxSize: 1000,
    // skyboxColor: new BABYLON.Color3.Teal(),
    CreateGround: true,
    enableGroundShadow: true,
    groundYBias: 1
});

const skysphere = BABYLON.MeshBuilder.CreateSphere("skysphere", {
    diameter: 1000,
    segments: 32  // Plus de segments pour une meilleure qualité visuelle
}, scene);

// Matériau pour le ciel
const skyMaterial = new BABYLON.StandardMaterial("skyMaterial", scene);
skyMaterial.backFaceCulling = false; // Affiche l'intérieur de la sphère
skyMaterial.diffuseTexture = new BABYLON.Texture("/skybox/skybox.jpg", scene); // Remplace par ton image
skyMaterial.diffuseTexture.coordinatesMode = BABYLON.Texture.SPHERICAL_MODE; // Mode sphérique
skyMaterial.specularColor = new BABYLON.Color3(0, 0, 0); // Pas de reflets brillants
skyMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1); // Rend l'image lumineuse, sans dépendre de la lumière

// Application du matériau à la sphère
skysphere.material = skyMaterial;
skysphere.isPickable = false; // Empêche l'interaction avec la sphère
skysphere.infiniteDistance = true; // Reste fixe par rapport à la caméra


skysphere.scaling.y = -1;


// BABYLON.SceneLoader.ImportMesh("", "/3d_object/", "jongleAnnimationV4.glb", scene, function (newMeshes, particleSystems, skeletons, animationGroups) {

//     newMeshes.forEach(mesh => {
//         if (mesh.material) {
//             mesh.material.transparencyMode = 0;
//             mesh.material.backFaceCulling = false;
//             if (mesh.material.pbr) {
//                 mesh.material.pbr.usePhysicalLightFalloff = true;
//             }
//         }
//     });

//     let perso = newMeshes.find(mesh => mesh.name === "__root__");
//     if (perso) {
//         perso.scaling = new BABYLON.Vector3(3, 3, 3);
//         perso.position = new BABYLON.Vector3(-80, 2, -55);
//         perso.rotation = new BABYLON.Vector3(0, Math.PI/4, 0);
//     }

//     // Stopper toutes les animations d'abord
//     animationGroups.forEach(anim => {
//         anim.stop();
//     });

//     // Démarrer seulement l'animation de la balle et l'animation principale
//     const ballAnimation = animationGroups.find(anim => anim.name === "Ball low_Baked_0Action");
//     const mainAnimation = animationGroups.find(anim => anim.name === "Armature.006|mixamo.com|Layer0"); // ou Layer0.001
// 	// const mainAnimation2 = animationGroups.find(anim => anim.name === "Armature.001|mixamo.com|Layer0"); // ou Layer0.001


//     if (ballAnimation && mainAnimation) {
//         ballAnimation.start(true);
// 		mainAnimation.start(true);
//     }

// 	// if (mainAnimation2 && mainAnimation2 !== mainAnimation) {
// 	// 	mainAnimation2.start(true);
// 	// 	console.log("Animation principale 2 démarrée");
// 	// }

//     if (typeof controlPerso === "function") {
//         controlPerso(perso);
//     }
// });







BABYLON.SceneLoader.ImportMesh("", "/3d_object/", "testPersoPageDeGardeV1.glb", scene, function (newMeshes, particleSystems, skeletons, animationGroups) {

    newMeshes.forEach(mesh => {
        if (mesh.material) {
            mesh.material.transparencyMode = 0;
            mesh.material.backFaceCulling = false;
            if (mesh.material.pbr) {
                mesh.material.pbr.usePhysicalLightFalloff = true;
            }
        }
    });

    let perso = newMeshes.find(mesh => mesh.name === "__root__");
    if (perso) {
        perso.scaling = new BABYLON.Vector3(5.5, 5.5, 5.5);
        perso.position = new BABYLON.Vector3(-90, 1.5, -65);
        perso.rotation = new BABYLON.Vector3(0, Math.PI/4, 0);
    }

    if (typeof controlPerso === "function") {
        controlPerso(perso);
    }
});








// Fonction pour créer une plane avec texture d'herbe
function createGrassPlane(name, position) {
    const grassPlane = BABYLON.MeshBuilder.CreateGround(name, {width: 45, height: 50}, scene);
    const grassMaterial = new BABYLON.StandardMaterial(name + "Material", scene);
    grassMaterial.diffuseTexture = new BABYLON.Texture("/image/perfect-green-grass.jpg", scene);
    grassMaterial.backFaceCulling = false;
    // Amélioration de la qualité des textures
    grassMaterial.diffuseTexture.anisotropicFilteringLevel = 16;
    grassMaterial.diffuseTexture.uScale = 5;
    grassMaterial.diffuseTexture.vScale = 5;
    grassPlane.material = grassMaterial;
    grassPlane.position = position;
}

// Création des planes d'herbe
createGrassPlane("grassPlane1", new BABYLON.Vector3(-61.5, 1.3, -152));
createGrassPlane("grassPlane2", new BABYLON.Vector3(-61.5, 1.3, -102));
createGrassPlane("grassPlane3", new BABYLON.Vector3(-61.5, 1.3, -52));
createGrassPlane("grassPlane4", new BABYLON.Vector3(-106.5, 1.3, -152));
createGrassPlane("grassPlane5", new BABYLON.Vector3(-106.5, 1.3, -102));
createGrassPlane("grassPlane6", new BABYLON.Vector3(-106.5, 1.3, -52));

function createGrassPlane2(name, position) {
    const grassPlane = BABYLON.MeshBuilder.CreateGround(name, {width: 32.8, height: 58}, scene);
    const grassMaterial = new BABYLON.StandardMaterial(name + "Material", scene);
    grassMaterial.diffuseTexture = new BABYLON.Texture("/image/perfect-green-grass.jpg", scene);
    grassMaterial.backFaceCulling = false;
    // Amélioration de la qualité des textures
    grassMaterial.diffuseTexture.anisotropicFilteringLevel = 16;
    grassMaterial.diffuseTexture.uScale = 5;
    grassMaterial.diffuseTexture.vScale = 5;
    grassPlane.material = grassMaterial;
    grassPlane.position = position;
}

createGrassPlane2("grassPlane7", new BABYLON.Vector3(-23.6, 299.8, -102));
createGrassPlane2("grassPlane8", new BABYLON.Vector3(-23.6, 299.8, -44));
createGrassPlane2("grassPlane9", new BABYLON.Vector3(9.2, 299.8, -102));
createGrassPlane2("grassPlane10", new BABYLON.Vector3(9.2, 299.8, -44));

const views = {
    default: {
        position: new BABYLON.Vector3(-45.79301951065982, 5.879735371044789, -31.342210947081313),
        rotation: new BABYLON.Vector3(-0.029665280069011667, -2.566387085794712, 0)
    },
    vue1: {
        position: new BABYLON.Vector3(-121.10280824924784, 24.6207952767514, -174.07209971938224),
        rotation: new BABYLON.Vector3(-0.11883037823762914, -2.5943873381271416, 0)
    },
    vue2: {
        position: new BABYLON.Vector3(-18.362079870354155, 108.25251269427612, 25.862876364155152),
        rotation: new BABYLON.Vector3(0.030709202934622, -3.1253471752812234, 0)
    },
    vue3: {
        position: new BABYLON.Vector3(-54.75561421839585, 323.8935256263618, -69.46923226717574),
        rotation: new BABYLON.Vector3(0.04110218558828448, -1.5940112517089828, 0)
    },
	vue4: {
		position: new BABYLON.Vector3(107.45137114956808, 350.16014619598326, -71.0351214961887),
		rotation: new BABYLON.Vector3(0.3689776126123451, -1.5805112517089825, 0)
	},
    aerienne: {
        position: new BABYLON.Vector3(0, 100, 0),
        rotation: new BABYLON.Vector3(Math.PI/2, 0, 0)
    }
};

let currentTransitionAnimation = null;

// Fonction de transition améliorée avec courbe d'animation
function smoothTransition(targetPosition, targetRotation, duration = 1.5) {
    // Annuler l'animation précédente si elle existe
    if (currentTransitionAnimation) {
        scene.onBeforeRenderObservable.remove(currentTransitionAnimation);
    }

    const startPosition = camera.position.clone();
    const startRotation = camera.rotation.clone();
    const startTime = performance.now();

    // Créer des vecteurs temporaires pour éviter la création d'objets pendant l'animation
    const tempPosition = new BABYLON.Vector3();
    const tempRotation = new BABYLON.Vector3();

    // Fonction d'ease (lissage)
    const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    currentTransitionAnimation = scene.onBeforeRenderObservable.add(() => {
        const currentTime = performance.now();
        let t = (currentTime - startTime) / (duration * 1000);

        if (t >= 1) {
            camera.position.copyFrom(targetPosition);
            camera.rotation.copyFrom(targetRotation);
            scene.onBeforeRenderObservable.remove(currentTransitionAnimation);
            currentTransitionAnimation = null;
            return;
        }

        // Appliquer la fonction d'ease
        const easedT = easeInOutCubic(t);

        // Interpolation de la position
        BABYLON.Vector3.LerpToRef(startPosition, targetPosition, easedT, tempPosition);
        camera.position.copyFrom(tempPosition);

        // Interpolation de la rotation
        BABYLON.Vector3.LerpToRef(startRotation, targetRotation, easedT, tempRotation);
        camera.rotation.copyFrom(tempRotation);
    });
}

let loadingOverlay;
let isLoading = false;
let targetView = null;

function createLoadingOverlay() {
	loadingOverlay = document.createElement('div');
	loadingOverlay.id = 'loadingOverlay';
	loadingOverlay.innerHTML = `
		<link rel="stylesheet" href="./static/js/css/test.css">
		<div class="loading-container">
			<div class="spinner"></div>
			<div class="loading-text">Chargement<span>.</span><span>.</span><span>.</span></div>
		</div>
	`;
	document.body.appendChild(loadingOverlay);
}

function removeLoadingOverlay() {
	if (loadingOverlay) {
		console.log("Suppression de l'overlay...");
		loadingOverlay.style.opacity = '0';
		setTimeout(() => {
			if (loadingOverlay && loadingOverlay.parentNode) {
				document.body.removeChild(loadingOverlay);
				console.log("Overlay supprimé");
			}
			isLoading = false;
			console.log("isLoading:", isLoading);
			if (targetView) {
				changeView(targetView);
				targetView = null;
			}
		}, 1000);
	}
}
// Fonction de changement de vue améliorée
export function changeView(viewName) {
	const view = views[viewName];
	if (!view || window.currentView === viewName)
		return;
	const previousView = window.currentView;
	window.currentView = viewName;
	targetView = viewName;
	if (isLoading) {
		return;
	}
	smoothTransition(view.position, view.rotation, 1.5);
	handleViewTransitions(viewName, previousView);
}

function handleViewTransitions(viewName, previousView) {
	console.log("Changement de vue:", viewName);
	console.log("isLoading:", isLoading);
	if (isLoading)
		return;

	if (viewName === 'vue1')
	{
		console.log('Chargement de la vue 1...');
		// isLoading = true;
		changeView('vue1');

		setTimeout(() =>
		{
			window.currentView = 'vue1';
			createLoadingOverlay();
		}, 1500);

		setTimeout(() =>
		{
			// removeLoadingOverlay();
			changeView('vue2');
			// isLoading = false;
		}, 3500);
		setTimeout(() => removeLoadingOverlay(), 5000);
	}
	if (viewName === 'vue3')
	{
		console.log('Chargement de la vue 3...');
		// isLoading = true;
		createLoadingOverlay();
		
		setTimeout(() =>
		{
			changeView('vue3');
			window.currentView = 'vue3';
		}, 1500);
		setTimeout(() => 
		{
			removeLoadingOverlay();
			changeView('vue4');
		}, 3500);
		// setTimeout(() => removeLoadingOverlay(), 5000);
	}
}

// Gestion des touches pour les changements de vue

// Création de la lumière déplaçable
// Création d'une Point Light


// Boucle de rendu améliorée
engine.runRenderLoop(() => {
    // Ajuste la résolution du canvas à la taille de l'écran
    const scale = window.devicePixelRatio;
    if (canvas.width !== canvas.clientWidth * scale || canvas.height !== canvas.clientHeight * scale) {
        engine.resize(true);
        canvas.width = canvas.clientWidth * scale;
        canvas.height = canvas.clientHeight * scale;
    }
	// console.log(camera.position, camera.rotation);
    scene.render();
});

// Gestionnaire de redimensionnement amélioré
window.addEventListener('resize', () => {
    engine.resize(true);
});

// Optimisation supplémentaire pour les textures
scene.onBeforeRenderObservable.add(() => {
    scene.meshes.forEach(mesh => {
        if (mesh.material && mesh.material.diffuseTexture) {
            mesh.material.diffuseTexture.anisotropicFilteringLevel = 16;
        }
    });
});







// ImageToStl.com_football_stadiumv2.glb
// versionFinalV2.glb
// ImageToStl.com_footballterraindejeuxv2.glb
// testPersoPageDeGardeV1.glb
// jongleAnnimationV4.glb