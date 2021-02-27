import { Request, Response } from "express";
import { getCustomRepository, getRepository } from "typeorm";
import { UserRepository } from "../repositories/UserRepository";
import { AppErrors } from "../errors/AppErrors";
import { User } from "../models/User";
import * as yup from 'yup';

class UserController {

    async create(req: Request, res: Response) {
        // console.log(req.body);
        
        const { name, email } = req.body;

        const schema = yup.object().shape({
            name: yup.string().required("Name is a Required Field!"),
            email: yup.string().email().required("Incorrect Email!")
        });

        // if (!(await !schema.isValid(req.body))) return res.status(400).json({ error: "Validation Failed!" });
        try {
            await schema.validate(req.body, { abortEarly: false });
        } catch (err) {
            throw new AppErrors(err);
            // return res.status(400).json({ error: err });
        }

        // const usersRepository = getRepository(User);
        const usersRepository = getCustomRepository(UserRepository);

        // pesquisou se o email já existe no database
        const userAlreadyExists = await usersRepository.findOne({ email });

        if (userAlreadyExists) {
            throw new AppErrors("User Already Exists!");
            // return res.status(400).json({ error: "User Already Exists!" });
        }

        // console.log(User);

        // Mapeia o objeto para dar match na entidade User
        const user = usersRepository.create({ name, email }); 

        await usersRepository.save(user);

        return res.status(201).json(user);
    }
}

export { UserController }