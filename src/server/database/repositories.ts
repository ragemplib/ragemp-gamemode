import { AppDataSource } from "./index";
import User from "./entities/user";
import Character from "./entities/character";

export const userRepository = AppDataSource.getRepository(User)

export const characterRepository = AppDataSource.getRepository(Character)
