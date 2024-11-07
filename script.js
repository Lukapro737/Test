function validateForm() {
    const response = grecaptcha.getResponse();
    if (response.length === 0) {
        alert("Please confirm that you are not a robot.");
        return false;
    }
    return true; // Allow form submission if validated
}