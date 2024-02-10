window.addEventListener('resize', function() {
    const canvas = document.getElementById('canvas');
    const controls = document.querySelector('.controls');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    controls.style.height = window.innerHeight + 'px';
});