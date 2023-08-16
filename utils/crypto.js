const DikaCryptJS = require("dikacryptjs")

const CryptJS = new DikaCryptJS.CryptJS({
    useHex: true,
})

const salt = CryptJS.genSaltSync()

exports.encryptData = (text) => {
    const value = CryptJS.encrypt(text, salt, "Hex")
    return value
}

exports.decryptData = (text) => {
    const value = CryptJS.decrypt(text, salt, "Hex")
    return value
}

