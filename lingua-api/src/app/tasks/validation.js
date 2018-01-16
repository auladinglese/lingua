import Joi from 'joi'
import * as restify from 'restify'

function formatValidationError(joiValidationError) {
    const validationErrors = joiValidationError.details
        .map((e) => {
            return {
                field: e.path.join('.'),
                message: e.message
            }
        })

    return {
        validationErrors
    }
}

export function validate(schema) {
    return (req, resp, next) => {
        const validationResult = Joi.validate(req.body, schema, {
            abortEarly: false,
            stripUnknown: true
        })
        if (validationResult.error) {
            resp.status(400)
            resp.send(formatValidationError(validationResult.error))
            resp.end()
            next(false)
        } else {
            req.body = validationResult.value
            next()
        }
    }
}
