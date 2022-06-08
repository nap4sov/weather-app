class Loader {
    showBackdrop = element => {
        element.classList.remove('.is-hidden');
    };
    hideBackdrop = element => {
        element.classList.add('.is-hidden');
    };
}

export default Loader;
