import type { DateTime } from "luxon";

export { User, UserPosition, JobTitle };

declare global {
    interface User {
        id: number;
        kcUserId: string;
        name: string;
        username: string;
        email: string;
        startDate: Date;
        endDate: Date;
    }

    interface UserPosition {
        id: number;
        user: User;
        jobPosition: JobPosition;
    }

    interface JobPosition {
        id: number;
        company: Company;
        jobTitle: JobTitle;
        parent: JobPosition?;
        name: string;
        startDate: Date;
        endDate: Date;
        code: string;
    }


    interface JobTitle {
        id: number;
        code: string;
        name: string;
        startDate: string;
        endDate: string;
    }

    interface UserSignature{
        id: number;
        user: User;
        fileUrl: string;
        startedAt: DateTime;
        endedAt: DateTime;
    }
}
