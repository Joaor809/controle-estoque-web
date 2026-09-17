function deleteToken(response: Response) {
    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');

        window.location.replace('/login');
        return true;
    }

    return false;
}

export default deleteToken;