import {useState} from "react"
import useValidation from "./useValidation"

function useChangeHandler(initialState, defaultValid) {
    const [value, setValue] = useState(initialState)
    const [isDirty, setDirty] = useState(false)
    const validation = useValidation(value, defaultValid)
    // debugger
    // console.log(validation)

    function onChangeInput(e) {
        setValue(e.target.value)
    }

    function clearVal() {
        setValue("")
        setDirty(false)
    }

    function changeDirty() {
        setDirty(true)
    }

    return { value, isDirty, onChangeInput, changeDirty, validation, clearVal }
}

export default useChangeHandler