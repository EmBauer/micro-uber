import {z} from "zod";

export const LocationSchema = z.object({
    place_id: z.number(),
    display_name: z.string(),
    lat: z.coerce.number(),
    lon: z.coerce.number(),
}).transform(old => {
    const {place_id, display_name, ...rest } = old;

    return {
        ...rest,
        placeId: place_id,
        displayName: display_name
    }
});

export const Locations = z.array(LocationSchema);

export type Location = z.infer<typeof LocationSchema>;
