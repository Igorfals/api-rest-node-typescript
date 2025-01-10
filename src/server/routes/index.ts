import { Router, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { CidadeController } from '../../controllers'

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Hello Word!');
});

router.post('/cidades', CidadeController.create);
export { router }