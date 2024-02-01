class SceneController {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight - 80), 0.1, 1000);
        this.camera.position.z = 10;
        this.initialCameraZ = this.camera.position.z;
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight - 80);
        document.body.appendChild(this.renderer.domElement);

        // Agregar un fondo degradado o una textura al fondo de la escena
        const textureLoader = new THREE.TextureLoader();
        const backgroundTexture = textureLoader.load('background.jpg');
        this.scene.background = backgroundTexture;

        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };

        this.bindEvents();
        this.render();
    }

    bindEvents() {
        document.addEventListener('mousedown', this.onDocumentMouseDown.bind(this), false);
        document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
        document.addEventListener('mouseup', this.onDocumentMouseUp.bind(this), false);
        document.addEventListener('wheel', this.onDocumentMouseWheel.bind(this), false);
        window.addEventListener('resize', this.onWindowResize.bind(this));

        document.addEventListener('keydown', this.onKeyDown.bind(this), false);
    }

    onDocumentMouseDown(event) {
        this.isDragging = true;
        this.previousMousePosition = { x: event.clientX, y: event.clientY };
    }

    onDocumentMouseMove(event) {
        if (this.isDragging) {
            const deltaMove = {
                x: event.clientX - this.previousMousePosition.x,
                y: event.clientY - this.previousMousePosition.y
            };
            this.camera.rotation.y += deltaMove.x * 0.01;
            this.camera.rotation.x += deltaMove.y * 0.01;
            this.previousMousePosition = { x: event.clientX, y: event.clientY };
        }
    }

    onDocumentMouseUp(event) {
        this.isDragging = false;
    }

    onDocumentMouseWheel(event) {
        const delta = event.deltaY;
        this.camera.position.z += delta * 0.01;
        this.camera.position.z = Math.max(this.camera.position.z, 1);
        this.camera.position.z = Math.min(this.camera.position.z, this.initialCameraZ * 2);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / (window.innerHeight - 80);
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight - 80);
    }

    toggleWireframe() {
        this.wireframeMode = !this.wireframeMode;
        this.scene.traverse(child => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
                child.material.wireframe = this.wireframeMode;
            }
        });
    }

    render() {
        requestAnimationFrame(() => this.render());
        this.renderer.render(this.scene, this.camera);
    }

    onKeyDown(event) {
        const moveDistance = 0.1;
        switch (event.key) {
            case 'w':
            case 'ArrowUp':
                this.camera.position.z -= moveDistance;
                break;
            case 'a':
            case 'ArrowLeft':
                this.camera.position.x -= moveDistance;
                break;
            case 's':
            case 'ArrowDown':
                this.camera.position.z += moveDistance;
                break;
            case 'd':
            case 'ArrowRight':
                this.camera.position.x += moveDistance;
                break;
        }
    }
}

const sceneController = new SceneController();