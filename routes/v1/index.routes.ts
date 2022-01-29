import { router } from '../router.ts';
import status from '../../controllers/status.ts';

export const loadV1Routes = () => {
    router.redirect('/', '/status');
    router.get('/status', status);
};
