import type { ZodTypeAny } from "zod";
import { z } from "zod";

export function addParametersToDescription(
    description: string,
    schema: z.ZodTypeAny
): string {
    let paramLines: string[] = [];

    if (schema instanceof z.ZodObject) {
        const shape = schema.shape;
        paramLines = Object.entries<ZodTypeAny>(shape).map(([key, value]) => {
            const isOptional = value.isOptional();
            const paramDescription = value.description || "";
            const typeStr = getTypeString(value);

            return `- ${key}${
                isOptional ? " (optional)" : ""
            } (${typeStr}): ${paramDescription}`;
        });
    } else {
        const isOptional = schema.isOptional();
        const paramDescription = schema.description || "";
        const typeStr = getTypeString(schema);

        paramLines.push(
            `- ${
                isOptional ? "(optional) " : ""
            }(${typeStr}): ${paramDescription}`
        );
    }

    return `${description}\n${paramLines.join("\n")}`;
}

function getTypeString(schema: z.ZodTypeAny): string {
    if (schema instanceof z.ZodString) {
        return "string";
    }
    if (schema instanceof z.ZodNumber) {
        return "number";
    }
    if (schema instanceof z.ZodBoolean) {
        return "boolean";
    }
    if (schema instanceof z.ZodArray) {
        return "array";
    }
    if (schema instanceof z.ZodObject) {
        return "object";
    }
    return "unknown";
}

export function replaceToolPlaceholder(
    template: string,
    wordForTool = "tool"
): string {
    const placeholderRegex = /\{\{\s*tool\s*\}\}/g;
    return template.replace(placeholderRegex, wordForTool);
}
