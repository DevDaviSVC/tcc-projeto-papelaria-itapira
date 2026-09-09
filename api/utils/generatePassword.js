import bcrypt from "bcrypt";

const password = "exemplo";

bcrypt.hash(password, 10)
    .then(hash => {
        console.log(hash);
    })
    .catch(error => {
        console.error(error);
    });