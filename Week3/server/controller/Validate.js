const validate = (text) => text;

const validateInput = (number) => {
    const regexp = /^\d{4, 11}$/;
    const checkResult = regexp.exec(number);
    if (checkResult) return {
        isInputValid: true,
        errorMessage: ''
    }; else return {
        isInputValid: false,
        errorMessage: '4 to 11 number'
    }
}

const validateEmail = (email) => {
    const regexp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return regexp.exec(email);
}


