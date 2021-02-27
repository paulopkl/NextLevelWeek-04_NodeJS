import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UserRepository } from "../repositories/UserRepository";
import SendMailService from "../services/SendMailService";

import { resolve } from 'path';
import { AppErrors } from "../errors/AppErrors";

class SendMailController {

    async execute(req: Request, res: Response) {
        const { email, survey_id } = req.body;

        const usersRepository = getCustomRepository(UserRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);


        const user = await usersRepository.findOne({ email });
        if (!user) {
            throw new AppErrors("User doesn't Exists!");
            // return res.status(400).json({ error: "User doesn't Exists!" });
        }
        
        const survey = await surveysRepository.findOne({ id: survey_id });
        if (!survey) {
            throw new AppErrors("Survey doesn't Exists!");
            // return res.status(400).json({ error: "Survey doesn't Exists!" });
        }

        // path: Get the file regardless of the OS
        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
            where: { user_id: user.id, value: null }, // Verify if the user already exists 
            relations: ["user", "survey"],
        });
          
        const variables = {
            // id: surveyUserAlreadyExists.id,
            id: "",
            name: user.name,
            title: survey.title,
            description: survey.description,
            link: process.env.URL_MAIL
        } 

        if (surveyUserAlreadyExists) {
            // SEND: Send the email
            variables.id = surveyUserAlreadyExists.id;
            await SendMailService.execute(email, survey.title, variables, npsPath);
            return res.json(surveyUserAlreadyExists);
        }

        // DATABASE: Creates the model equals to field in table surveyUser
        const surveyUser = surveysUsersRepository.create({ user_id: user.id, survey_id });
        
        // DATABASE: Saves the data in the table surveyUser
        await surveysUsersRepository.save(surveyUser);

        variables.id = surveyUser.id;
        
        // SEND: Send the email
        await SendMailService.execute(email, survey.title, variables, npsPath);

        return res.json(surveyUser);
    }
}

export { SendMailController }