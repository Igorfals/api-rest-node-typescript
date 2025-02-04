import { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from 'yup'
import { validation } from "../../shared/middleware";

interface ICidade {
  nome: string
  estado: string
}
interface IFilter {
  filter?: string
}

export const createBodyValidator = validation((getSchema) => ({
  body: getSchema<ICidade>(yup.object().shape({
    nome: yup.string().required().min(3),
    estado: yup.string().required().min(3)
  })),
  query: getSchema<IFilter>(yup.object().shape({
    filter: yup.string().optional().min(3)
  }))
}));

export const create = async (req: Request<{}, {}, ICidade>, res: Response) => {
  console.log(req.body);
  res.send('Create!!');
  return
}