export default function sair() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.replace('/login');
}