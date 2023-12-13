import { z } from "zod"

const HasID = z.object({ id: z.number() })

export const SongSchema = z.object({
    name: z
    .string({
        required_error: 'Name is required'
    })
    .trim()
    .min(1, 'Name cannot be empty'),
    performer: z
    .string({
        required_error: 'Performer name is required'
    })
    .trim()
    .min(1, 'Performer name cannot be empty'),
    description: z
    .string({
        required_error: 'Description is required'
    })
    .trim()
    .min(1, 'Description cannot be empty')
    .max(100, 'Description cannot be too long'),
    releaseYear: z
    .number({
      required_error: 'Release Year is required',
    })
    .int()
    .gte(1)
    .lte(2024),
    image: z
    .string({
        required_error: 'Image is required'
    })
})

export const SongWithId = SongSchema.merge(HasID)

export type Song = z.infer<typeof SongWithId>