import { ETResult } from "./EnterpriseTable";

export interface ESServer<T> {
    toValueLabel(item: T) : ESOption;

    findSelectOptions(query: ESQuery) : Promise<ETResult<ESOption>>;

}

export interface ESOption {
    value: string;
    label: string;
}

export interface ESQuery {
    pageIndex: string;
    pageSize: string;
    search: string;
    // Autofill
    valueField?: string;
    labelField?: string;
    // Custom Filter
    customFilter?: string;
}

