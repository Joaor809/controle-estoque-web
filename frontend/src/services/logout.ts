export default function sair() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.replace('/login');
}