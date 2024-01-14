declare namespace Express {
    export interface Request {
        question: (import("mongoose").Document<
            unknown,
            {},
            import("./trivia.model").Question
        > &
            import("./trivia.model").Question &
        {
            _id: Types.ObjectId;
        })
        | null;
    }
}

declare namespace Express {
    export interface Request {
        trivia: (import("mongoose").Document<
            unknown,
            {},
            import("./trivia.model").Trivia
        > &
            import("./trivia.model").Trivia &
        {
            _id: Types.ObjectId;
        })
        | null;
    }
}