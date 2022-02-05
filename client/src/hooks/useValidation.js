import { useState, useEffect} from "react"

function useValidation(value, validations) {
    const [isEmty, setIsEmpty] = useState({ status: false, message: null })
    const [minLength, setMinLength] = useState({ status: false, message: null })
    const [maxLength, setMaxLength] = useState({ status: false, message: null })
    const [isEmail, setIsEmail] = useState({ status: false, message: null })

    const [validInput, setValidInput] = useState(false)


    useEffect(() => {
        for (const valid in validations) {
            switch (valid) {
                case "isEmty": {
                    if (value.length == 0) {
                        setIsEmpty({ status: true, message: validations.isEmty.message || "You should fill in this field" })
                    } else {
                        setIsEmpty({ status: false, message: null })
                    }
                    break;
                }
                case "minLength": {
                    if (value.length < validations.minLength.count) {
                        setMinLength({ status: true, message: validations.minLength.message || "This field must have more 3 characters" })
                    } else {
                        setMinLength({ status: false, message: null })
                    }
                    break
                }
                case "maxLength": {
                    if (value.length > validations.maxLength.count) {
                        setMaxLength({ status: true, message: validations.maxLength.message || "This field must less more 12 characters" })
                    } else {
                        setMaxLength({ status: false, message: null })
                    }
                    break
                }

                case "isEmail": {
                    if (validations.isEmail.status === true) {
                        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        if (!re.test(String(value).toLowerCase())) {
                            setIsEmail({ status: true, message: validations.isEmail.message || "This field must fill in in example: mail@mail.ru" })
                        } else {
                            setIsEmail({ status: false, message: null })
                        }
                    }
                    break
                }

                default: {
                    break
                }
            }
        }
    }, [value])


    useEffect(() => {
        if (isEmty.status || minLength.status || maxLength.status || isEmail.status) {
            setValidInput(false)
        } else {
            setValidInput(true)
        }
    }, [isEmty, minLength, maxLength, isEmail])

    return { isEmty, minLength, maxLength, isEmail, validInput }
}


export default useValidation