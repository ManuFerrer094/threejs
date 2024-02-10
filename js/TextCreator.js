class TextCreator {
    constructor() {
        this.fontLoader = new THREE.FontLoader();
        this.fontLoader.load('Roboto_Regular.json', font => {
            this.font = font;
            this.createTextFromJson();
        });
    }

    createTextFromJson() {
        fetch('datos.json')
            .then(response => response.json())
            .then(data => {
                if (!data || !data.nodos) {
                    throw new Error('El archivo JSON no contiene datos válidos');
                }
    
                data.nodos.forEach(nodo => {
                    const textGeometry = new THREE.TextGeometry(nodo.nombre, {
                        font: this.font,
                        size: 0.5,
                        height: 0.1,
                        curveSegments: 12
                    });
                    textGeometry.computeBoundingBox(); // Calcular el cuadro delimitador del texto
                    const textMesh = new THREE.Mesh(textGeometry, new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    
                    // Ajustar la posición para centrar el texto en su posición
                    const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
                    const xOffset = -textWidth / 2;
                    textMesh.position.set(nodo.posicion.x + xOffset, nodo.posicion.y, nodo.posicion.z);
    
                    sceneController.scene.add(textMesh);
                });
            })
            .catch(error => console.error('Error al cargar los datos:', error));
    }    

    changeTextColor(color) {
        sceneController.scene.traverse(child => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
                child.material.color.set(color);
            }
        });
    }

    changeTextValue(value) {
        sceneController.scene.traverse(child => {
            if (child instanceof THREE.Mesh && child.geometry instanceof THREE.TextGeometry) {
                child.geometry.dispose();
                const textGeometry = new THREE.TextGeometry(value, {
                    font: this.font,
                    size: 0.5,
                    height: 0.1,
                    curveSegments: 12
                });
                child.geometry = textGeometry;
            }
        });
    }
}

const textCreator = new TextCreator();
