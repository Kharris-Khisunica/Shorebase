import { EntityTarget, FindManyOptions, Like, ObjectLiteral, Repository, SelectQueryBuilder } from "typeorm";
import { AppDataSource } from "../dataSource";
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";

export class ETServer<T extends ObjectLiteral> {
    columns : ETColumnDefinition<T>[];
    repository : Repository<T>;

    constructor(entityClass: EntityTarget<T>) {
        this.repository = AppDataSource.getRepository(entityClass);
    }

    setColumns(columns: ETColumnDefinition<T>[]) {
        this.columns = columns;
    }

    async findAll(query: ETQuery, customizeQuery?: (qb: SelectQueryBuilder<T>) => SelectQueryBuilder<T>): Promise<ETResult<T>> {
        const alias = this.repository.metadata.name;
        const qb = this.repository.createQueryBuilder(alias);

        // Pagination
        const pageIndex = parseInt(query.pageIndex) || 0;
        const pageSize = parseInt(query.pageSize) || 100;
        qb.skip(pageIndex * pageSize).take(pageSize);
        
        // Sorting
        const sorting : { id?: string, desc: string } = JSON.parse(query.sorting || '{}');
        if (sorting.id) {
            const sortParts = sorting.id.split('.');
            const sortDirection = sorting.desc ? 'DESC' : 'ASC';

            // Handle nested relations (e.g., jobPosition.jobTitle.name)
            let fullPath = `${alias}.${sorting.id}`;
            if (sortParts.length > 1) {
                fullPath = sortParts.reduce((acc, part, i) => {
                    const path = i === 0 ? `${part}` : `${acc}.${part}`;
                    return path;
                }, '');
            }

            qb.orderBy(fullPath, sortDirection as 'ASC' | 'DESC');
        }

        // Column Filter
        let columnFilters: { id: string, value: string }[] = [];
        if (query.columnFilters) {
            if (typeof query.columnFilters === 'string') {
                columnFilters.push(JSON.parse(query.columnFilters));
            } else {
                columnFilters = query.columnFilters.map((cf) => JSON.parse(cf));
            }
        }
        
        for (const cf of columnFilters) {
            let metadata = this.getNestedColumnMetadata(cf.id);
            const isString = metadata && ['string', 'text', 'varchar'].includes(metadata.type as string);

            let prefix = `${alias}.`;
            let cfId = cf.id;
            if (cf.id.split('.').length > 1) {
                prefix = '';
                cfId = `${cf.id.split('.').slice(0, -1).join('_')}.${cf.id.split('.')[cf.id.split('.').length-1]}`;
            }

            if (isString) {
                qb.andWhere(`${prefix}${cfId} LIKE :filter_${cfId}`, {
                    [`filter_${cfId}`]: `%${cf.value}%`,
                });
            } else {
                qb.andWhere(`${prefix}${cfId} = :filter_${cfId}`, {
                    [`filter_${cfId}`]: cf.value,
                });
            }
        }

        if (customizeQuery) {
            customizeQuery(qb);
        }
        
        const [data, total] = await qb.getManyAndCount();

        return {
            total,
            pageIndex,
            pageSize,
            data
        }
    }

    async findByPk(pk: Partial<T>, options?: FindManyOptions<T>) {
        return await this.repository.findOne({
            where: {
                ...pk
            },
            ...options
        });
    }

    async create(item: T) {
        return await this.repository.save(item);
    }

    async update(item: T) {
        return await this.repository.save(item);
    }

    async delete(item: T) {
        return await this.repository.remove(item);
    }

    getNestedColumnMetadata(path: string): ColumnMetadata | undefined {
        const parts = path.split('.');
        let metadata = this.repository.metadata;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];

            // If it's the last part, try to resolve as column
            if (i === parts.length - 1) {
                const column = metadata.findColumnWithPropertyName(part);
                return column;
            }

            // Try to resolve as relation for next level
            const relation = metadata.findRelationWithPropertyPath(part);
            if (!relation) return undefined;

            metadata = AppDataSource.getMetadata(relation.type);
        }

        return undefined;
    }
}

export class ETColumnDefinition<T> {
    key: (keyof T) | string;
    title: string;
    render: ((row: T) => string | Promise<string>);

    visible: boolean = true;
    sorting: null | 'disabled' | 'asc' | 'desc' = null;
    filtering: 'disabled' | 'enabled' | any[] = 'disabled';
    filtering_exact: boolean = false;
    edit: boolean = true;

    constructor(config: Partial<ETColumnDefinition<T>> & Pick<ETColumnDefinition<T>, 'key' | 'title'>) {
        Object.assign(this, config);
    }
}

export interface ETQuery {
    pageIndex?: string;
    pageSize?: string;
    sorting?: string;
    columnFilters?: string | string[];
}

export type ETResult<T> = {
    total: number;
    pageIndex: number;
    pageSize: number;
    data: T[]
}
