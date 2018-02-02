import * as argon2 from 'argon2'

const argon2Options = {
    timeCost: 1,
    memoryCost: 10,
    parallelism: 1
}

export async function hash(password) {
    return await argon2.hash(password, argon2Options)
}

export async function verify(hash, password) {
    return await argon2.verify(hash, password)
}
