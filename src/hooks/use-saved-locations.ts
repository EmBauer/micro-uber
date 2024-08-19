import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {loadLocations, saveLocation} from "../data-access/saved-locations.ts";

export function useSavedLocations() {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['savedLocations'],
        queryFn: loadLocations,
    });

    const mutation = useMutation({
        mutationFn: saveLocation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['savedLocations'] });
        },
    });

    return {
        locations: query.data ?? [],
        isLoading: query.isLoading,
        error: query.error,
        saveLocation: mutation.mutate,
    };
}
