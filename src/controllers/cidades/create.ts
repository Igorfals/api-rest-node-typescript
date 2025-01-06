import { Request, Response } from "express";
import * as yup from 'yup'

interface ICidade {
  nome: string
}

const bodyValidation: yup.Schema<ICidade> = yup.object().shape({
  nome: yup.string().required().min(3)
});

export const create = async (req: Request<{}, {}, ICidade>, res: Response) => {
  let validateData: ICidade | undefined = undefined;

  try {
    validateData = await bodyValidation.validate(req.body);
  } catch (error) {
    const yupErro = error as yup.ValidationError;

    return res.json({
      errors: {
        default: yupErro.message
      }
    })
  }

  console.log(validateData);

  return res.send('Create!!');
}