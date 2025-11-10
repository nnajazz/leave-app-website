import { z } from 'zod/v4';

// validasi request body yang pada route login
const loginFormRequest = z.object({
    email: z.string(),
    password: z.string().max(50)
});

export default loginFormRequest;