import { router } from '../router.ts';
import status from '../../controllers/status.ts';

export const loadV1Routes = () => {
    router.get('/status', status);
};
