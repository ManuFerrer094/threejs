class SceneController {
    constructor() {
        this.initScene();
        this.initRenderer();
        this.initCamera();
        this.initControls();
        this.initEvents();
        this.render();
    }

    initControls() {
        // OrbitControls para habilitar interacción con dispositivos táctiles
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableZoom = true;
        this.controls.enableRotate = true;
        this.controls.enablePan = true;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.2;
    }

    initScene() {
        this.scene = new THREE.Scene();
        const textureLoader = new THREE.TextureLoader();
        const backgroundTexture = textureLoader.load('light.jpg');
        this.scene.background = backgroundTexture;
    }

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 10;
        this.initialCameraZ = this.camera.position.z;
    }

    initEvents() {
        // Eventos de mouse
        document.addEventListener('mousedown', this.onDocumentMouseDown.bind(this), false);
        document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
        document.addEventListener('mouseup', this.onDocumentMouseUp.bind(this), false);
        document.addEventListener('wheel', this.onDocumentMouseWheel.bind(this), false);

        // Eventos táctiles
        document.addEventListener('touchstart', this.onDocumentTouchStart.bind(this), false);
        document.addEventListener('touchmove', this.onDocumentTouchMove.bind(this), false);
        document.addEventListener('touchend', this.onDocumentTouchEnd.bind(this), false);

        // Evento de redimensionamiento de la ventana
        window.addEventListener('resize', this.onWindowResize.bind(this));

        // Evento de teclado
        document.addEventListener('keydown', this.onKeyDown.bind(this), false);
    }

    changeBackground() {
        if (this.scene.background.image.src.includes('light.jpg')) {
            this.setBackground('dark.jpg');
        } else {
            this.setBackground('light.jpg');
        }
    }    
    
    setBackground(imagePath) {
        const textureLoader = new THREE.TextureLoader();
        const backgroundTexture = textureLoader.load(imagePath);
        this.scene.background = backgroundTexture;
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

    onDocumentTouchStart(event) {
        const touch = event.touches[0];
        this.isDragging = true;
        this.previousMousePosition = { x: touch.clientX, y: touch.clientY };
    }

    onDocumentTouchMove(event) {
        if (this.isDragging) {
            const touch = event.touches[0];
            const deltaMove = {
                x: touch.clientX - this.previousMousePosition.x,
                y: touch.clientY - this.previousMousePosition.y
            };
            this.camera.rotation.y += deltaMove.x * 0.01;
            this.camera.rotation.x += deltaMove.y * 0.01;
            this.previousMousePosition = { x: touch.clientX, y: touch.clientY };
        }
    }

    onDocumentTouchEnd(event) {
        this.isDragging = false;
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
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
