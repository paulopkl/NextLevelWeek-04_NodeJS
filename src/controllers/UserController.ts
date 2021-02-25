import { Request, Response } from "express";
import { getCustomRepository, getRepository } from "typeorm";
import { User } from "../models/User";
import { UserRepository } from "../repositories/UserRepository";

class UserController {

    async create(req: Request, res: Response) {
        // console.log(req.body);
        
        const { name, email } = req.body;

        // const usersRepository = getRepository(User);
        const usersRepository = getCustomRepository(UserRepository);

        // pesquisou se o email já existe no database
        const userAlreadyExists = await usersRepository.findOne({ email });

        if (userAlreadyExists) return res.status(400).json({ error: "User Already Exists!" });

        // console.log(User);

        // Mapeia o objeto para dar match na entidade User
        const user = usersRepository.create({ name, email }); 

        await usersRepository.save(user);

        return res.status(201).json(user);
    }
}

export { UserController }