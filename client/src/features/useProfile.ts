import {useQueryClient} from '@tanstack/react-query';

const useProfile = () => {
    const queryClient = useQueryClient();
    const query:profileType|undefined = queryClient.getQueryData(['userProfile']);
    return {query};
}
export default useProfile;

interface profileType{
    data:{
        user:{
            id:number,
            name:string,
            picture:string,
            email:string,
        }
    }
}