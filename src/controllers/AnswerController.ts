import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppErrors } from "../errors/AppErrors";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";


class AnswerController {

    // http://localhost:3333/answers/1?u=a92sc1sa32-1232-1sas-a121as2sa12
    // router.get("/answers/:value")

    async execute(req: Request, res: Response) {
        const { value } = req.params;
        const { u } = req.query;

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const surveyUser = await surveysUsersRepository.findOne({ id: String(u) });

        if (!surveyUser) {
            throw new AppErrors("Survey User doesn't exists!");
            // return res.status(400).json({ error: "Survey User doesn't exists!" });
        }

        surveyUser.value = Number(value);

        await surveysUsersRepository.save(surveyUser);

        return res.json(surveyUser);
    }
}

export { AnswerController }