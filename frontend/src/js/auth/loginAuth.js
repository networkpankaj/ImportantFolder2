export function setupLogin() {
    const formElement = document.querySelector(".form");
    if (formElement) {
        document.querySelector(".form").addEventListener('submit', e => {
            e.preventDefault();
        });
    } else {
        console.error("Form element with class 'form' not found.");
    }
};
