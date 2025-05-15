document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value.trim();
    
    if (nombre) {
        // Guardar el nombre del usuario en localStorage
        localStorage.setItem('nombreUsuario', nombre);
        
        // Redirigir al cuestionario
        window.location.href = 'index.html';
    }
}); 