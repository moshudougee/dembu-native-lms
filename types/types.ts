
export interface SearchResponse {
    results: Course[];
}

export interface Instructor {
    id: number;
    title: string;
    display_name: string;
}

export interface Course {
    id: number;
    title: string;
    url: string;
    is_paid: boolean;
    price: string;
    visible_instructors: Instructor[];
    image_125_H: string;
    image_240x135: string;
    is_practise_test_course: boolean;
    image_480x270: string;
    published_title: string;
    tracking_id: string;
    locale: {
        title: string;
        english_title: string;
        simple_english_title: string;
    };
    result: any;
    sub_title: string;
    num_reviews: number;
    image_240x13: string;
}

export interface CurriculumItem {
    _class: string;
    id: number;
    title: string;
    description?: string;
    content_summary?: string;
    is_free?: boolean;
    sort_order?: number;
}

export interface CurriculumData {
    count: number;
    next: string | null;
    previous: string | null;
    results: CurriculumItem[];
}

export interface User {
    _class: string;
    title: string;
    name: string;
    display_name: string;
}

export interface Review {
    _class: string;
    id: number;
    content: string;
    rating: number;
    created: string;
    modified: string;
    user_modified: string;
    user? : User; 
}