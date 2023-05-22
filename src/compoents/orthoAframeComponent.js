AFRAME.registerComponent('ortho', {
    init: function () {
        var sceneEl = this.el.sceneEl;
        this.orthoCamera = new THREE.OrthographicCamera(0, 4, 0.75);
        sceneEl.camera = this.orthoCamera;

        sceneEl.addEventListener('render-target-loaded', () => {
            // this.originalCamera = sceneEl.camera;
            // this.cameraParent = sceneEl.camera.parent;
            // this.orthoCamera = new THREE.OrthographicCamera(0, 4, 0.75);
            // this.cameraParent.add(this.orthoCamera);
            // sceneEl.camera = this.orthoCamera;
        });
    },
    remove: function () {
        // this.cameraParent.remove(this.orthoCamera);
        // sceneEl.camera = this.originalCamera;
    }
});
