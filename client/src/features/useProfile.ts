import {useQueryClient} from '@tanstack/react-query';
import {profileType} from "../types/ProfileType.ts";

const useProfile = () => {
    const queryClient = useQueryClient();
    const query:profileType|undefined = queryClient.getQueryData(['userProfile']);
    const id = query?.data.user.id || "";
    const name = query?.data.user.name || "";
    const email = query?.data.user.email || "";
    const picture = query?.data.user.picture || "";
    return {id,name,email,picture};
}

export default useProfile;

