import { FindManyOptions, Like } from "typeorm";
import { AppDataSource } from "../../dataSource";
import { JobTitle } from "../../entity/user/JobTitle";
import { ETResult, ETServer } from "../../components/EnterpriseTable";
import { ESOption, ESQuery, ESServer } from "../../components/EnterpriseSelect";

class JobTitleET extends ETServer<JobTitle> implements ESServer<JobTitle> {
    constructor() {
        super(JobTitle);
    }

    toValueLabel(item: JobTitle): ESOption {
        return { value: item.id.toString(),label: item.name  };
    }

    async findSelectOptions(query: ESQuery) {
        const pageIndex = parseInt(query.pageIndex) || 0;
        const pageSize = parseInt(query.pageSize) || 25;

        const [data, total] = await this.repository.findAndCount({
            where: {
                name: Like(`%${query.search}%`)
            },
            take: pageSize,
            skip: pageIndex * pageSize
        });

        const options = data.map(c => this.toValueLabel(c));
        return {
            total,
            pageIndex,
            pageSize,
            data: options
        }
    }
    
}

const jobTitleET = new JobTitleET();

export default jobTitleET;

const jobTitleRepo = AppDataSource.getRepository(JobTitle);

export async function getJobTitles(take: number, skip: number, options: FindManyOptions<JobTitle>) {
    const [result, total] = await jobTitleRepo.findAndCount(
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

export async function getJobTitle(id: number, options: FindManyOptions<JobTitle>) {
    return await jobTitleRepo.findOne({
        where: {
            id
        },
        ...options
    });
}

export async function saveJobTitle(jobTitle: JobTitle) {
    return await jobTitleRepo.save(jobTitle);
}

export async function deleteJobTitle(jobTitle: JobTitle) {
    return await jobTitleRepo.delete({ id: jobTitle.id });
}
