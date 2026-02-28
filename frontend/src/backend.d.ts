import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Project {
    title: string;
    link: string;
    description: string;
}
export interface Milestone {
    title: string;
    date: string;
    description: string;
}
export interface ContactLink {
    url: string;
    platform: string;
}
export interface Student {
    bio: string;
    projects: Array<Project>;
    name: string;
    achievements: Array<string>;
    contactLinks: Array<ContactLink>;
    skills: Array<string>;
    timeline: Array<Milestone>;
}
export interface backendInterface {
    getAllStudents(): Promise<Array<[Principal, Student]>>;
    getStudent(id: Principal): Promise<Student | null>;
    getStudentRecordKey(): Promise<Principal>;
}
