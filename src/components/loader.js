export function showLoader(element) {
    element.classList.remove('.is-hidden');
}

export function hideLoader(element) {
    setTimeout(() => {
        element.classList.add('is-hidden');
    }, 500);
}
