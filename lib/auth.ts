import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

import { isUserRole, USER_ROLES } from "@/lib/roles";

const client = new MongoClient(process.env.MONGODB_URL as string);
const db = client.db("hireloop");

/**
 * Standard Schema validator for the `role` field so only the
 * supported roles ("seeker" | "recruiter" | "admin") reach the database.
 */
const roleValidator = {
    "~standard": {
        version: 1 as const,
        vendor: "hireloop",
        validate: (value: unknown) =>
            isUserRole(value)
                ? { value }
                : {
                      issues: [
                          {
                              message: `Role must be one of: ${USER_ROLES.join(", ")}`,
                          },
                      ],
                  },
    },
};

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client,
    }),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                // The client must send the role on sign-up and it is stored
                // on the user document in MongoDB.
                input: true,
                required: true,
                validator: {
                    input: roleValidator,
                },
            },
        },
    },
    databaseHooks: {
        user: {
            create: {
                // Backstop: never persist a user without a valid role,
                // even if a future code path bypasses the field validator.
                before: async (user) => {
                    if (!isUserRole(user.role)) {
                        throw APIError.from("BAD_REQUEST", {
                            code: "MISSING_ROLE",
                            message: `Please choose a role: ${USER_ROLES.join(", ")}`,
                        });
                    }
                    return { data: user };
                },
            },
        },
    },
});
