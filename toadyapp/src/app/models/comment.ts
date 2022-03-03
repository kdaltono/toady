export interface Comment {
    isCurrentUserComment: boolean,
    user_id: string,
    comment_id: number,
    full_name: string,
    comment_text: string,
    dstamp: string
};