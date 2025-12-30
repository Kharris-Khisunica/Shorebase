import { FindManyOptions } from "typeorm";
import { AppDataSource } from "../dataSource";
import { User } from "../entity/user/User";

const userRepo = AppDataSource.getRepository(User);

export async function getUsers(take: number, skip: number, options: FindManyOptions<User>) {
    const [result, total] = await userRepo.findAndCount(
        {
            take: take,
            skip: skip,
            ...options
        }
    );

    return {
        data: result,
        count: total
    }
}

export async function getUser(id: number) {
    const user = await userRepo.findOneBy({ id: id });
    return user;
}

export async function getByKeycloakUserId(kcUserId: string) {
    const user = await userRepo.findOneBy({ kcUserId: kcUserId });
    return user;
}

export async function saveUser(user: User) {
    return await userRepo.save(user);
}