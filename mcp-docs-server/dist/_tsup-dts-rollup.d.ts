import { MCPClient } from '@mastra/mcp';
import { MCPServer } from '@mastra/mcp';
import { ServerType } from '@hono/node-server';
import z from 'zod';

export declare const blogPostSchema: z.ZodObject<{
    slug: z.ZodString;
    content: z.ZodString;
    metadata: z.ZodObject<{
        title: z.ZodString;
        publishedAt: z.ZodString;
        summary: z.ZodString;
        image: z.ZodOptional<z.ZodString>;
        author: z.ZodOptional<z.ZodString>;
        draft: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        categories: z.ZodUnion<[z.ZodArray<z.ZodString, "many">, z.ZodString]>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        publishedAt: string;
        summary: string;
        draft: boolean;
        categories: string | string[];
        image?: string | undefined;
        author?: string | undefined;
    }, {
        title: string;
        publishedAt: string;
        summary: string;
        categories: string | string[];
        image?: string | undefined;
        author?: string | undefined;
        draft?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    content: string;
    slug: string;
    metadata: {
        title: string;
        publishedAt: string;
        summary: string;
        draft: boolean;
        categories: string | string[];
        image?: string | undefined;
        author?: string | undefined;
    };
}, {
    content: string;
    slug: string;
    metadata: {
        title: string;
        publishedAt: string;
        summary: string;
        categories: string | string[];
        image?: string | undefined;
        author?: string | undefined;
        draft?: boolean | undefined;
    };
}>;

export declare function callTool(tool: any, args: any): Promise<string>;

export declare function copyRaw(): Promise<void>;

export declare function createLogger(server?: MCPServer): Logger;

export declare type DocsInput = z.infer<typeof docsInputSchema>;

export declare const docsInputSchema: z.ZodObject<{
    paths: z.ZodArray<z.ZodString, "many">;
    queryKeywords: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    paths: string[];
    queryKeywords?: string[] | undefined;
}, {
    paths: string[];
    queryKeywords?: string[] | undefined;
}>;

export declare const docsTool: {
    name: string;
    description: string;
    parameters: z.ZodObject<{
        paths: z.ZodArray<z.ZodString, "many">;
        queryKeywords: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        paths: string[];
        queryKeywords?: string[] | undefined;
    }, {
        paths: string[];
        queryKeywords?: string[] | undefined;
    }>;
    execute: (args: DocsInput) => Promise<string>;
};

export declare function fromPackageRoot(relative: string): string;

export declare function fromRepoRoot(relative: string): string;

export declare function getMatchingPaths(path: string, queryKeywords: string[], baseDir: string): Promise<string>;

export declare const log: {
    (...data: any[]): void;
    (message?: any, ...optionalParams: any[]): void;
};

export declare interface Logger {
    info: (message: string, data?: any) => Promise<void>;
    warning: (message: string, data?: any) => Promise<void>;
    error: (message: string, error?: any) => Promise<void>;
    debug: (message: string, data?: any) => Promise<void>;
}

export declare const logger: Logger;

export declare const mcp: MCPClient;

export declare function prepare(): Promise<void>;

export declare function runServer(): Promise<void>;

export declare let server: MCPServer;

export declare const server_alias_1: ServerType;

export declare const writeErrorLog: (message: string, data?: any) => void;

export { }
