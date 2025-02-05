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
camera.position = new BABYLON.Vector3(42, 4, -59);
camera.rotation = new BABYLON.Vector3(0, -2.4599999999999915, 0);
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
BABYLON.SceneLoader.Append("/3d_object/", "test6.glb", scene, function (scene) {
    console.log("Stade chargé avec succès !");
    
    const stade = scene.getMeshByName("Plane.001");
    stade.scaling = new BABYLON.Vector3(2, 2, 2);
    stade.position = new BABYLON.Vector3(0, 0, 0);

    // Configuration des matériaux pour le stade
    if (stade.material) {
        stade.material.transparencyMode = 0;
        stade.material.backFaceCulling = false;
        if (stade.material.pbr) {
            stade.material.pbr.usePhysicalLightFalloff = true;
        }
    }

    console.log("Nom du mesh :", stade.name);
});


const environment = scene.createDefaultEnvironment({
    createSkybox: false,
    // skyboxSize: 1000,
    // skyboxColor: new BABYLON.Color3.Teal(),
    CreateGround: true,
    enableGroundShadow: true,
    groundYBias: 1
});

// const skymaterial = new BABYLON.StandardMaterial("skyMaterial", scene);
// skymaterial.backFaceCulling = false;
// skymaterial.reflectionTexture = new BABYLON.CubeTexture("/skybox/skybox", scene);
// skymaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
// skymaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
// skymaterial.specularColor = new BABYLON.Color3(0, 0, 0);
// const skybox = BABYLON.MeshBuilder.CreateBox("skybox", {size: 10000}, scene);
// skybox.material = skymaterial;
// Création de la sphère pour le ciel

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


// Chargement du personnage
BABYLON.SceneLoader.Append("/3d_object/", "persoTest.glb", scene, function (scene) {
    console.log("perso chargé avec succès !");

    scene.meshes.forEach(mesh => {
        console.log("Nom du mesh :", mesh.name);
        
        // Configuration des matériaux
        if (mesh.material) {
            mesh.material.transparencyMode = 0;
            mesh.material.backFaceCulling = false;
            if (mesh.material.pbr) {
                mesh.material.pbr.usePhysicalLightFalloff = true;
            }
        }
    });

    const perso = scene.getMeshByName("__root__");
    perso.scaling = new BABYLON.Vector3(2.5, 2.5, 2.5);
    perso.position = new BABYLON.Vector3(20, 2, -65);
    perso.rotation = new BABYLON.Vector3(0, 45, 0);

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
createGrassPlane("grassPlane1", new BABYLON.Vector3(19, 0.5, -152));
createGrassPlane("grassPlane2", new BABYLON.Vector3(19, 0.5, -102));
createGrassPlane("grassPlane3", new BABYLON.Vector3(19, 0.5, -52));
createGrassPlane("grassPlane4", new BABYLON.Vector3(-26, 0.5, -152));
createGrassPlane("grassPlane5", new BABYLON.Vector3(-26, 0.5, -102));
createGrassPlane("grassPlane6", new BABYLON.Vector3(-26, 0.5, -52));

const views = {
    default: {
        position: new BABYLON.Vector3(42, 4, -59),
        rotation: new BABYLON.Vector3(0, -2.4599999999999915, 0)
    },
    vue1: {
        position: new BABYLON.Vector3(500, 500, 500),
        rotation: new BABYLON.Vector3(0.5, 0.8, 0)
    },
    vue2: {
        position: new BABYLON.Vector3(20, 10, -100),
        rotation: new BABYLON.Vector3(0.2, 0, 0)
    },
    vue3: {
        position: new BABYLON.Vector3(-30, 20, -80),
        rotation: new BABYLON.Vector3(0.3, -0.5, 0)
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

// Fonction de changement de vue améliorée
function changeView(viewName) {
    const view = views[viewName];
    if (!view) {
        console.warn(`Vue '${viewName}' non définie`);
        return;
    }

    if (window.currentView === viewName) {
        return;
    }

    window.currentView = viewName;
    smoothTransition(view.position, view.rotation);

    // Désactiver temporairement les contrôles de la caméra pendant la transition
    camera.detachControl(canvas);
    setTimeout(() => {
        camera.attachControl(canvas, true);
    }, 1500);
}

// Gestion des touches pour les changements de vue

// Création de la lumière déplaçable
// Création d'une Point Light


window.addEventListener('keydown', (event) => {
    switch(event.key) {
        case '1':
            changeView('vue1');
            break;
        case '2':
            changeView('vue2');
            break;
        case '3':
            changeView('vue3');
            break;
        case '4':
            changeView('aerienne');
            break;
        case '0':
            changeView('default');
            break;
        case 'w':
            pointLight.position.z += 1;
            break;
        case 's':
            pointLight.position.z -= 1;
            break;
        case 'a':
            pointLight.position.x -= 1;
            break;
        case 'd':
            pointLight.position.x += 1;
            break;
        case 'q':
            pointLight.position.y += 1;
            break;
        case 'e':
            pointLight.position.y -= 1;
            break;

        // Autres contrôles existants...
    }
});


// Boucle de rendu améliorée
engine.runRenderLoop(() => {
    // Ajuste la résolution du canvas à la taille de l'écran
    const scale = window.devicePixelRatio;
    if (canvas.width !== canvas.clientWidth * scale || canvas.height !== canvas.clientHeight * scale) {
        engine.resize(true);
        canvas.width = canvas.clientWidth * scale;
        canvas.height = canvas.clientHeight * scale;
    }
    console.log(camera.position);
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