import { Request, Response, Router } from 'express';
import { validateSignup, catchAsync } from '../middlewares/inputValidator';
import { ClassesService } from '../services/sampleService';
import { SuccessResponse } from '../helper/apiResponse';

const router = Router();
const service = new ClassesService();

router.post('/signup', validateSignup, catchAsync(async (req: Request, res: Response) => {
  const response = await service.Testing();
  new SuccessResponse(response, 1).send(res);
}));

export default router;