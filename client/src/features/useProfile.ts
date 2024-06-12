import {useContext} from 'react'
import ProfileContext from "./UserProvider.tsx";
import {UseProfileContextType} from "./UserProvider.tsx"

const useProfile = ():UseProfileContextType => {
    return useContext(ProfileContext)
}
export default useProfile

