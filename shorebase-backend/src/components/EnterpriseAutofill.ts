import { ETResult } from "./EnterpriseTable";
import { ESOption, ESQuery } from "./EnterpriseSelect";

export interface EAServer<T> {
    findSelectObject(query: ESQuery) : Promise<ETResult<T & ESOption>>
}

