export const enum PasswordStrength {
    Short,
    Common,
    Weak,
    Ok,
    Strong,
};

function MinimumLengh(): number {
    return 7;
}

// Regex to check for a common password string - all based on 5+ length passwords
let commonPasswordPatterns = /^passw.*|12345.*|09876.*|qwert.*|abc123.*|asdfg.*|zxcvb.*|footb.*|baseb.*|drago.*/;

function isPasswordCommon(password: string): boolean {
    return (commonPasswordPatterns.test(password));
}

export function checkPasswordStrength(password: string): PasswordStrength {
    let currentPaswordStrength = PasswordStrength.Short;

    let verifElements = 0;
    verifElements = /.*[a-z].*/.test(password) ? ++verifElements : verifElements;
    verifElements = /.*[A-Z].*/.test(password) ? ++verifElements : verifElements;
    verifElements = /.*[0-9].*/.test(password) ? ++verifElements : verifElements;
    verifElements = /[^a-zA-Z0-9]/.test(password) ? ++verifElements : verifElements;

    if (password === null || password.length < MinimumLengh()) {
        currentPaswordStrength = PasswordStrength.Short;
    }
    else if (isPasswordCommon(password)) {
        currentPaswordStrength = PasswordStrength.Common;
    }
    else if (verifElements < 3) {
        currentPaswordStrength = PasswordStrength.Weak;
    }
    else if (verifElements === 3) {
        currentPaswordStrength = PasswordStrength.Ok;
    }
    else {
        currentPaswordStrength = PasswordStrength.Strong;
    }

    return (currentPaswordStrength);
}
