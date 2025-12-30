import type { TableColumn } from "@nuxt/ui";
import type { ZodType } from "zod";

export type ETColumnType = 'text' | 'number';

export type ETColumn<T> = TableColumn<T> & {
    primaryKey?: boolean,   // is this column a primary key?
    alias_for_id?: string,  // it is a label (alias) for other column (usually alias for the primary key (id))
    form_name?: string,     // form name submitted to server, default to id

    edit?: 'disabled' | 'enabled' = 'disabled',
    hidden?: boolean,
    optional?: boolean = false, // is the column optional to fill

    type: 'select' | 'text' | 'date' | 'date_time' |'number' | 'void' |'boolean' | 'autofill' | 'multi-select',
    validationType?: ZodType,
    select_option_url?: string, // used both for selection in filter and edit form
    
    autofill_url?: string;
    autofill_value_field?: string;
    autofill_label_field?: string;
    autofill_target_fields?: {
        [form_name: string]: string | { value: string; label: string; readOnly? : boolean = false } ;
    };
    onClick?: (T) => void;
    custom_filter?: (FormState: any) => string | undefined
}

export type ETResult<T> = {
    total: number;
    pageIndex: number;
    pageSize: number;
    data: T[]
}

export type ETCustomAction<T> = {
    label: string;
    onClick?: (T) => void
}
